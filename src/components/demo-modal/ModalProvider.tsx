'use client';

import React, {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useRef,
    useSyncExternalStore,
} from 'react';

interface ModalEntry {
    id: string;
    key: string;
    namespace: string;
    payload: unknown;
    resolve: (value: unknown) => void;
}

interface OpenModalOptions<TPayload> {
    key: string;
    namespace: string;
    payload?: TPayload;
}

interface ModalStoreSnapshot {
    stack: ModalEntry[];
    resolvingMap: Record<string, boolean>;
}

interface ModalStore {
    getSnapshot: () => ModalStoreSnapshot;
    getServerSnapshot: () => ModalStoreSnapshot;
    subscribe: (listener: () => void) => () => void;
    openModal: <TPayload = unknown, TResult = unknown>(
        options: OpenModalOptions<TPayload>
    ) => Promise<TResult | undefined>;
    closeModal: (id: string, result?: unknown) => void;
    closeTop: (result?: unknown) => void;
    resolveModal: <TResult>(
        id: string,
        executor: () => Promise<TResult> | TResult
    ) => Promise<void>;
}

const createModalStore = (): ModalStore => {
    let state: ModalStoreSnapshot = {
        stack: [],
        resolvingMap: {},
    };

    const listeners = new Set<() => void>();

    const getSnapshot = () => state;
    const getServerSnapshot = () => state;

    const notify = () => {
        listeners.forEach(listener => listener());
    };

    const setState = (updater: (prev: ModalStoreSnapshot) => ModalStoreSnapshot) => {
        const nextState = updater(state);
        if (nextState === state) {
            return;
        }
        state = nextState;
        notify();
    };

    const setResolving = (id: string, value: boolean) => {
        setState(prev => {
            const currentlyResolving = !!prev.resolvingMap[id];
            if (value) {
                if (currentlyResolving) {
                    return prev;
                }
                return {
                    stack: prev.stack,
                    resolvingMap: { ...prev.resolvingMap, [id]: true },
                };
            }
            if (!currentlyResolving) {
                return prev;
            }
            const { [id]: _, ...rest } = prev.resolvingMap;
            return {
                stack: prev.stack,
                resolvingMap: rest,
            };
        });
    };

    const openModal = <TPayload, TResult>({ key, namespace, payload }: OpenModalOptions<TPayload>) =>
        new Promise<TResult | undefined>(resolve => {
            const entry: ModalEntry = {
                id: crypto.randomUUID(),
                key,
                namespace,
                payload: payload as unknown,
                resolve,
            };

            setState(prev => ({
                stack: [...prev.stack, entry],
                resolvingMap: prev.resolvingMap,
            }));
        });

    const closeModal = (id: string, result?: unknown) => {
        let resolvedEntry: ModalEntry | undefined;

        setState(prev => {
            const entryIndex = prev.stack.findIndex(item => item.id === id);
            if (entryIndex === -1) {
                return prev;
            }

            resolvedEntry = prev.stack[entryIndex];

            const nextStack = [
                ...prev.stack.slice(0, entryIndex),
                ...prev.stack.slice(entryIndex + 1),
            ];
            const { [id]: _, ...restResolving } = prev.resolvingMap;

            return {
                stack: nextStack,
                resolvingMap: restResolving,
            };
        });

        resolvedEntry?.resolve(result);
    };

    const closeTop = (result?: unknown) => {
        let resolvedEntry: ModalEntry | undefined;

        setState(prev => {
            if (!prev.stack.length) {
                return prev;
            }

            resolvedEntry = prev.stack[prev.stack.length - 1];
            const { [resolvedEntry.id]: _, ...restResolving } = prev.resolvingMap;

            return {
                stack: prev.stack.slice(0, -1),
                resolvingMap: restResolving,
            };
        });

        resolvedEntry?.resolve(result);
    };

    const resolveModal = async <TResult,>(
        id: string,
        executor: () => Promise<TResult> | TResult
    ) => {
        setResolving(id, true);
        try {
            const result = await executor();
            closeModal(id, result);
        } finally {
            setResolving(id, false);
        }
    };

    const subscribe = (listener: () => void) => {
        listeners.add(listener);
        return () => {
            listeners.delete(listener);
        };
    };

    return {
        getSnapshot,
        getServerSnapshot,
        subscribe,
        openModal,
        closeModal,
        closeTop,
        resolveModal,
    };
};

const ModalContext = createContext<ModalStore | undefined>(undefined);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
    const storeRef = useRef<ModalStore>();

    if (!storeRef.current) {
        storeRef.current = createModalStore();
    }

    return <ModalContext.Provider value={storeRef.current}>{children}</ModalContext.Provider>;
};

export const useModalManager = () => {
    const store = useContext(ModalContext);

    if (!store) {
        throw new Error('useModalManager must be used within ModalProvider');
    }

    const snapshot = useSyncExternalStore(
        store.subscribe,
        store.getSnapshot,
        store.getServerSnapshot
    );

    return useMemo(
        () => ({
            stack: snapshot.stack,
            openModal: store.openModal,
            closeModal: store.closeModal,
            closeTop: store.closeTop,
            resolveModal: store.resolveModal,
            isResolving: (id: string) => !!snapshot.resolvingMap[id],
        }),
        [snapshot, store]
    );
};

export const useModalController = (namespace: string) => {
    const { openModal } = useModalManager();
    return useCallback(
        <TPayload = unknown, TResult = unknown>(key: string, payload?: TPayload) =>
            openModal<TPayload, TResult>({ key, namespace, payload }),
        [namespace, openModal]
    );
};

interface ModalSlot<TPayload> {
    id: string;
    payload: TPayload;
    close: (result?: unknown) => void;
    resolveWith: <TResult>(executor: () => Promise<TResult> | TResult) => Promise<void>;
    index: number;
    isTop: boolean;
    isResolving: boolean;
}

export const useModalSlot = <TPayload = unknown>(
    namespace: string,
    key: string
): ModalSlot<TPayload> | undefined => {
    const { stack, closeModal, resolveModal, isResolving } = useModalManager();

    return useMemo(() => {
        for (let i = stack.length - 1; i >= 0; i--) {
            const entry = stack[i];
            if (entry.namespace === namespace && entry.key === key) {
                return {
                    id: entry.id,
                    payload: entry.payload as TPayload,
                    close: (result?: unknown) => closeModal(entry.id, result),
                    resolveWith: <TResult,>(executor: () => Promise<TResult> | TResult) =>
                        resolveModal(entry.id, executor),
                    index: i,
                    isTop: i === stack.length - 1,
                    isResolving: isResolving(entry.id),
                } as ModalSlot<TPayload>;
            }
        }
        return undefined;
    }, [stack, closeModal, resolveModal, isResolving, namespace, key]);
};

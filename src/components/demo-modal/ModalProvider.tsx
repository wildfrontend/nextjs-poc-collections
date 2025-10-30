'use client';

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

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

interface ModalContextValue {
    stack: ModalEntry[];
    openModal: <TPayload = unknown, TResult = unknown>(options: OpenModalOptions<TPayload>) => Promise<TResult | undefined>;
    closeModal: (id: string, result?: unknown) => void;
    closeTop: (result?: unknown) => void;
    resolveModal: <TResult>(id: string, executor: () => Promise<TResult> | TResult) => Promise<void>;
    isResolving: (id: string) => boolean;
}

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
    const [stack, setStack] = useState<ModalEntry[]>([]);
    const [resolvingMap, setResolvingMap] = useState<Record<string, boolean>>({});

    const setResolving = useCallback((id: string, value: boolean) => {
        setResolvingMap(prev => {
            if (value) {
                if (prev[id]) return prev;
                return { ...prev, [id]: true };
            }
            if (!prev[id]) return prev;
            const { [id]: _, ...rest } = prev;
            return rest;
        });
    }, []);

    const openModal = useCallback(
        <TPayload, TResult>({ key, namespace, payload }: OpenModalOptions<TPayload>) =>
            new Promise<TResult | undefined>(resolve => {
                const entry: ModalEntry = {
                    id: crypto.randomUUID(),
                    key,
                    namespace,
                    payload: payload as unknown,
                    resolve,
                };
                setStack(prev => [...prev, entry]);
            }),
        []
    );

    const closeModal = useCallback(
        (id: string, result?: unknown) => {
            setStack(prev => {
                const entry = prev.find(item => item.id === id);
                if (entry) {
                    entry.resolve(result);
                }
                return prev.filter(item => item.id !== id);
            });
            setResolving(id, false);
        },
        [setResolving]
    );

    const resolveModal = useCallback(
        async <TResult,>(id: string, executor: () => Promise<TResult> | TResult) => {
            setResolving(id, true);
            try {
                const result = await executor();
                closeModal(id, result);
            } finally {
                setResolving(id, false);
            }
        },
        [closeModal, setResolving]
    );

    const closeTop = useCallback(
        (result?: unknown) => {
            setStack(prev => {
                if (!prev.length) return prev;
                const entry = prev[prev.length - 1];
                entry.resolve(result);
                setResolving(entry.id, false);
                return prev.slice(0, -1);
            });
        },
        [setResolving]
    );

    const isResolving = useCallback((id: string) => !!resolvingMap[id], [resolvingMap]);

    const value = useMemo<ModalContextValue>(
        () => ({
            stack,
            openModal,
            closeModal,
            closeTop,
            resolveModal,
            isResolving,
        }),
        [stack, openModal, closeModal, closeTop, resolveModal, isResolving]
    );

    return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
};

export const useModalManager = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModalManager must be used within ModalProvider');
    }
    return context;
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

export const useModalSlot = <TPayload = unknown>(namespace: string, key: string): ModalSlot<TPayload> | undefined => {
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

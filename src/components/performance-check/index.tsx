import React, { memo, useEffect, useState } from 'react';

const IncrementButton = () => {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>Increment: {count}</button>
  );
};

const FetchUserListItem = memo(
  ({ user }: { user: { id: number; username: string } }) => {
    return <li>{user.username}</li>;
  }
);

const FetchUserList = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const ac = new AbortController();
    fetch('https://dummyjson.com/users', { signal: ac.signal })
      .then((res) => res.json())
      .then((data) => setUsers(data.users))
      .catch((err) => {
        if (err.name !== 'AbortError') console.error(err);
      });

    return () => ac.abort();
  }, []);
  return (
    <ul>
      {users.map((user: { id: number; username: string }) => (
        <FetchUserListItem key={user.id} user={user} />
      ))}
    </ul>
  );
};

const UserList = () => {
    
  return (
    <div>
      <h2>User List</h2>
      <IncrementButton />
      <FetchUserList />
    </div>
  );
};

export default UserList;

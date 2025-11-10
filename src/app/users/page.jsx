import { readUsers } from '@/db/actions/user'

export default async function UsersPage()
{
  const users = await readUsers()

  return (
    <div>
      <h1>Users List</h1>
      <ul>
        {users.map( user => (
          <li key={user.id}>[{user.id}] {user.name} ({user.email})</li>
        ))}
      </ul>
    </div>
  )
}

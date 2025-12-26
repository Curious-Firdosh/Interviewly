
import { SignInButton, SignOutButton, UserButton } from '@clerk/clerk-react'


function App() {
  

  return (
    <>
        <h1>Welcome To The App</h1>
        <SignOutButton>
            <SignInButton mode='modal'/>
        </SignOutButton>

        <SignInButton>
            <SignOutButton/>
        </SignInButton>

        <UserButton/>
    </>
  )
}

export default App

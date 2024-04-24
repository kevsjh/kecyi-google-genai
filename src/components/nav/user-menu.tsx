

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useAuthContext } from '@/context/auth-context'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'sonner'


// export interface UserMenuProps {
//   user: Session['user']
// }

function getUserInitials(name: string) {
  const [firstName, lastName] = name.split(' ')
  return lastName ? `${firstName[0]}${lastName[0]}` : firstName.slice(0, 2)
}

export function UserMenu() {
  const { auth, invokeUserSignOut } = useAuthContext()
  const router = useRouter()
  const pathname = usePathname()
  if (auth.currentUser === null) {
    return
  }


  async function onUserSignOut() {
    try {
      // await auth.signOut()
      // router.refresh()
      await invokeUserSignOut()
      if (pathname.startsWith("/profile")) {
        router.push('/')
      }
      router.refresh()
      toast.success("Signed out successfully")
    } catch (err) {
      console.log("Failed to sign out", err)
    }
  }



  return (
    <div className="flex items-center justify-between">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="pl-0">
            <div className="flex size-7 shrink-0 select-none items-center justify-center rounded-full bg-muted/50 text-xs font-medium uppercase text-muted-foreground">
              {getUserInitials(auth.currentUser?.email ?? '')}
            </div>
            <span className="ml-2 hidden md:block">{auth.currentUser?.email}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent sideOffset={8} align="start" className="w-fit">
          <DropdownMenuItem className="flex-col items-start">
            <div className="text-xs text-zinc-500">{auth.currentUser?.email}</div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <form
          // action={async () => {
          //   'use server'
          //   // await signOut()
          // }}
          >
            <button
              onClick={onUserSignOut}
              className=" relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-xs outline-none transition-colors hover:bg-red-500 hover:text-white focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
              Sign Out
            </button>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

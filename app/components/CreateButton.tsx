import { Plus } from 'lucide-react'
import Link from 'next/link'

const CreateButton = () => {
  return (
    <div className='fixed bottom-8 sm:bottom-6 right-6 z-50'>
      <Link href='/create' className='h-full w-full flex justify-end items-end cursor-pointer'>
        <Plus width={36} height={36}/>
      </Link>
    </div>
  )
}

export default CreateButton
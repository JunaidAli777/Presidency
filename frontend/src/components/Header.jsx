'use client'
import { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import {
  Dialog,
  DialogPanel,
  PopoverGroup
} from '@headlessui/react'

import {
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'

import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../redux/authSlice'

import college_logo from '/files/images/presidency-college-berhampur.png'
import college_icon from '/files/images/college-icon.png'

export default function Example() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    setLogoutConfirmOpen(true);
  }

  const confirmLogout = () => {
    sessionStorage.removeItem('role');
    if (sessionStorage.getItem('facultyToken')) {
      sessionStorage.removeItem('facultyToken');
    } else if (sessionStorage.getItem('adminToken')) {
      sessionStorage.removeItem('adminToken');
    }
    dispatch(logout());
    setLogoutConfirmOpen(false);
    navigate('/login');
  };

  return (
    <header className="bg-black">
      <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <Link to='/' className="-m-1.5 p-1.5 bg-white rounded-sm">
            <span className="sr-only">Presidency College</span>
            <img
              alt="img"
              src={college_logo}
              className="h-8 w-auto"
            />
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white hover:bg-gray-700 hover:cursor-pointer"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
        <PopoverGroup className="hidden lg:flex lg:gap-x-12">

          <Link to='/' className="text-sm/6 font-semibold text-white px-2 py-0.5 rounded-sm hover:bg-gray-500">
            Home
          </Link>

          <Link to='/faculties' className="text-sm/6 font-semibold text-white px-2 py-0.5 rounded-sm hover:bg-gray-500">
            Faculty Members
          </Link>

          <Link to='/students' className="text-sm/6 font-semibold text-white px-2 py-0.5 rounded-sm hover:bg-gray-500">
            Students
          </Link>
          
        </PopoverGroup>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg: gap-x-8">
        {isLoggedIn ? (
            <button 
              onClick={handleLogout}
              className="text-sm/6 font-semibold text-white px-2 py-0.5 rounded-sm hover:bg-gray-500 hover:cursor-pointer"
            >
              <span aria-hidden="true">&larr;</span> Log Out
            </button>
          ) : (
            <>
              <Link to='/signup' className="text-sm/6 font-semibold text-white px-2 py-0.5 rounded-sm hover:bg-gray-500">
                Sign Up
              </Link>

              <Link to='/login' className="text-sm/6 font-semibold text-white px-2 py-0.5 rounded-sm hover:bg-gray-500">
                Log In <span aria-hidden="true">&rarr;</span>
              </Link>
            </>
          )}
        </div>
      </nav>
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
          <Link to='/' className="-m-1.5 p-1.5 bg-white rounded-sm">
            <span className="sr-only">Presidency College</span>
            <img
              alt="img"
              src={college_icon}
              className="h-8 w-auto"
            />
          </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700 hover:cursor-pointer"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">

                <Link to='/' className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-black hover:text-white">
                  Home
                </Link>
                
                <Link to='/faculties' className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-black hover:text-white">
                  Faculty Members
                </Link>

                <Link to='/students' className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-black hover:text-white">
                  Students
                </Link>

              </div>
              <div className="py-6">
                {isLoggedIn ? (
                    <button 
                      onClick={handleLogout}
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-black hover:text-white w-full text-left"
                    >
                      Log Out
                    </button>
                  ) : (
                    <>
                      <Link to='/signup' className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-black hover:text-white">
                        Sign Up
                      </Link>

                      <Link to='/login' className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-black hover:text-white">
                        Log In
                      </Link>
                    </>
                  )}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>

      {/* Logout Confirmation Dialog */}
      <Dialog open={logoutConfirmOpen} onClose={() => setLogoutConfirmOpen(false)} className="fixed inset-0 z-10 flex items-center justify-center">
        {/* Dark overlay with reduced opacity */}
        <div className="fixed inset-0 bg-black/50"></div>

        {/* Dialog panel */}
        <DialogPanel className="relative bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
          <h2 className="text-lg font-semibold text-gray-900">Confirm Logout</h2>
          <p className="mt-2 text-sm text-gray-600">Are you sure you want to log out?</p>

          <div className="mt-4 flex justify-end gap-3">
            <button
              onClick={() => setLogoutConfirmOpen(false)}
              className="cursor-pointer px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              onClick={confirmLogout}
              className="cursor-pointer px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-red-700 transition"
            >
              Log Out
            </button>
          </div>
        </DialogPanel>
      </Dialog>

    </header>
  )
}
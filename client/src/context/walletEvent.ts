import { toast } from 'react-toastify'
const notifyError = (account: string) => toast('You changed your account ')

// window.ethereum.on('accountsChanged', function (accounts) {
//   notifyError(accounts[0])
// })

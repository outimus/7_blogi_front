import { useSelector } from 'react-redux'
const Notification = () => {
  const notification = useSelector((state => state.notification))
  if (notification.content !== null) {
    return (
      <div className='notification'>
        {notification.content}
      </div>
    )}
}
export default Notification
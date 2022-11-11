import { useSelector } from 'react-redux'
const Notification = () => {
  const notification = useSelector((state => state.notification))
  console.log(notification.content)
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }
  if (notification.content !== null) {
    return (
      <div style={style}>
        {notification.content}
      </div>
    )}
}
export default Notification
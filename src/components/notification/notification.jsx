import PropTypes from 'prop-types';

export const Notification = ({ message }) => (
  <div>{message && <h3>{message}</h3>}</div>
);
Notification.proTotype = {
  message: PropTypes.string,
};
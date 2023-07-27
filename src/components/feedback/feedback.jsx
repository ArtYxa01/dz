import PropTypes from 'prop-types';
import css from './feedback.module.css';

export const FeedbackOptions = ({ options, leaveFeedback }) => {
  return options.map(option => (
    <button
      className={css.button}
      key={option}
      type="button"
      onClick={() => leaveFeedback(option)}
    >
      {option}
    </button>
  ));
};

FeedbackOptions.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  leaveFeedback: PropTypes.func.isRequired,
};
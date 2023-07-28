import { FeedbackOptions } from './feedback/feedback';
import { Notification } from './notification/notification';
import { Statistics } from './stats/stats';
import { Section } from './section/section';
import React from 'react';

export class App extends React.Component {
  state = {
    good: 0,
    neutral: 0,
    bad: 0,
  };
  onLeaveFeedback = option => {
    this.setState(prevState => ({
      [option]: prevState[option] + 1,
    }));
  };

  countTotalFeedback() {
    const { good, neutral, bad } = this.state;
    const result = good + neutral + bad;
    return result;
  }

  countPositiveFeedbackPercentage() {
    const { good, neutral, bad } = this.state;
    const percentage = (good / (good + neutral + bad)) * 100 || 0;
    return percentage.toFixed(0);
  }

  render() {
    const { good, neutral, bad } = this.state;
    const totalFeedback = this.countTotalFeedback();
    const positiveFeedbackPercentage = this.countPositiveFeedbackPercentage();
    return (
      <>
        <Section title="Please leave feedback">
          <FeedbackOptions
            options={Object.keys(this.state)}
            leaveFeedback={this.onLeaveFeedback}
          />
        </Section>
        <Section title="Statistics">
          {totalFeedback === 0 ? (
            <Notification message="There is no feedback" />
          ) : (
            <Statistics
              good={good}
              neutral={neutral}
              bad={bad}
              total={totalFeedback}
              positivePercentage={positiveFeedbackPercentage}
            />
          )}
        </Section>
      </>
    );
  }
}
import bookContacts from  '../data/bookContacts'
import { nanoid } from 'nanoid';
import { ContactForm } from '../contactform/contactform';
import { Filter } from '../contactfilter/contactfilter';
import { ContactList } from '../contactlist/contactlist';

const contacts = bookContacts.contacts;

export class App extends React.Component {
  state = {
    contacts,
    filter: '',
  };

  componentDidMount() {
    const contacts = localStorage.getItem('contacts');
    const parsedContacts = JSON.parse(contacts);
    if (parsedContacts) {
      this.setState({ contacts: parsedContacts });
    }
  }

  componentDidUpdate(prevState) {
    if (this.state.contacts !== prevState.contacts) {
      localStorage.setItem('contacts', JSON.stringify(this.state.contacts));
    }
  }

  onRemoveContact = contactId => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== contactId),
    }));
  };

  onAddContact = contactData => {
    const comparison = this.state.contacts.find(
      el => contactData.name.toLowerCase() === el.name.toLowerCase()
    );

    if (comparison) {
      alert(`${contactData.name} is already in contacts!`);
    }
    const contact = {
      ...contactData,
      id: nanoid(),
    };
    this.setState(prevState => ({
      contacts: [...prevState.contacts, contact],
    }));
  };

  changeFilter = e => {
    this.setState({ filter: e.target.value });
  };

  getFilteredContacts = () => {
    const { contacts, filter } = this.state;
    return contacts.filter(
      contact =>
        contact.name.toLowerCase().includes(filter.toLowerCase()) ||
        contact.number.toLowerCase().includes(filter.toLowerCase())
    );
  };

  render() {
    const { contacts, filter } = this.state;
    const filteredContacts = this.getFilteredContacts();
    return (
      <>
        <h1>Phonebook</h1>
        <ContactForm onAddContact={this.onAddContact} />
        <h2>Contacts</h2>
        {contacts.length !== 0 && (
          <Filter value={filter} onChange={this.changeFilter} />
        )}
        {contacts.length !== 0 && (
          <ContactList
            contacts={filteredContacts}
            onRemoveContact={this.onRemoveContact}
          />
        )}
      </>
    );
  }
}
App.propTypes = {
  contacts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      number: PropTypes.string.isRequired,
    })
  ),
  filter: PropTypes.string,
};
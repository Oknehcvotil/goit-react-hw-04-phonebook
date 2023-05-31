import { Component } from 'react';
import ContactForm from '../ContactForm';
import ContactList from '../ContactList';
import { nanoid } from 'nanoid';
import Filter from '../Filter';
import { Section, Title, TitleMain } from './App.styled';

const LS_KEY = 'contacts';

class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  componentDidMount() {
    const savedContacts = JSON.parse(localStorage.getItem(LS_KEY));

    if (savedContacts) {
      this.setState({ contacts: savedContacts });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const prevContacts = prevState.conatcts;
    const currentContacts = this.state.contacts;

    if (prevContacts !== currentContacts) {
      localStorage.setItem(LS_KEY, JSON.stringify(currentContacts));
    }
  }

  createContact = data => {
    const { name, number } = data;
    const { contacts } = this.state;
    const id = nanoid();

    const duplicate = contacts.some(
      contact =>
        contact.name.toLowerCase() === name.toLowerCase() &&
        contact.number === number
    );

    if (duplicate) {
      return alert(`${name} is already in contacts`);
    }

    const updatedContacts = [...contacts];
    updatedContacts.unshift({ id, name, number });

    this.setState({ contacts: updatedContacts });
  };

  changeFilter = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  getVisibleContacts = () => {
    const { contacts, filter } = this.state;

    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(filter.toLowerCase())
    );
  };

  deleteContact = contactId => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== contactId),
    }));
  };

  render() {
    const { contacts, filter } = this.state;
    const filtredContacts = this.getVisibleContacts();

    return (
      <>
        <Section title="Phonebook">
          <TitleMain>Phonebook</TitleMain>
          <ContactForm createContact={this.createContact} />
        </Section>
        <Section title="Contacts">
          <Title>Contacts</Title>
          {contacts.length > 0 && (
            <Filter value={filter} onChange={this.changeFilter} />
          )}
          {contacts.length > 0 && (
            <ContactList
              contacts={filtredContacts}
              deleteContact={this.deleteContact}
            />
          )}
        </Section>
      </>
    );
  }
}

export default App;

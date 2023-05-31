import { useState, useEffect } from 'react';
import ContactForm from '../ContactForm';
import ContactList from '../ContactList';
import { nanoid } from 'nanoid';
import Filter from '../Filter';
import { Section, Title, TitleMain } from './App.styled';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LS_KEY = 'contacts';

const App = () => {
  const [contacts, setContacts] = useState(() => {
    return JSON.parse(window.localStorage.getItem(LS_KEY)) ?? [];
  });
  const [filter, setFilter] = useState('');

  useEffect(() => {
    window.localStorage.setItem(LS_KEY, JSON.stringify(contacts));
  }, [contacts]);

  const createContact = data => {
    const { name, number } = data;
    const id = nanoid();

    const newContact = { id, name, number };

    const duplicate = contacts.some(
      contact =>
        contact.name.toLowerCase() === name.toLowerCase() &&
        contact.number === number
    );

    if (duplicate) {
      return toast.error(`${name} is already in contacts`);
    }

    setContacts(contacts => [...contacts, newContact]);
  };

  const changeFilter = e => {
    const { value } = e.target;

    setFilter(value);
  };

  const getVisibleContacts = () => {
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(filter.toLowerCase())
    );
  };

  const deleteContact = contactId => {
    setContacts(contacts.filter(contact => contact.id !== contactId));
  };

  const filtredContacts = getVisibleContacts();

  return (
    <>
      <Section title="Phonebook">
        <TitleMain>Phonebook</TitleMain>
        <ContactForm createContact={createContact} />
      </Section>
      <Section title="Contacts">
        <Title>Contacts</Title>
        {contacts.length > 0 && (
          <Filter value={filter} onChange={changeFilter} />
        )}
        {contacts.length > 0 && (
          <ContactList
            contacts={filtredContacts}
            deleteContact={deleteContact}
          />
        )}
      </Section>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default App;

import styles from '../../styles/Share.module.css'

import Head from 'next/head'
import { useEffect } from 'react';
import Link from 'next/link';
import { useState } from 'react';

export default function Share({ returned }) {

  const [content, setContent] = useState([]);

  useEffect(() => {
    if (returned.msg === 'failed') {
      setContent(['Invalid Share ID', 'Ask the person who shared you this for a new link'])
    } else {
      setContent(['Shared Note', 'The note has been stored in the web'])
      const data = JSON.parse(returned.msg);
      console.log(typeof data);
      let currentNotes = JSON.parse(localStorage.getItem("chill-notes-app-data"));
      if (currentNotes === null) {
        localStorage.setItem("chill-notes-app-data", []);
        currentNotes = [];
      }

      const date = new Date();
      const formattedDate = Intl.DateTimeFormat(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short'
      }).format(date);
      currentNotes.push({
        title: data.title,
        description: data.content,
        created: formattedDate,
      });

      localStorage.setItem("chill-notes-app-data", JSON.stringify(currentNotes));
    }
  }, [returned.msg]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Chill Notes: Shared Note</title>
        <meta name="description" content="store your notes in the web without the risk of losing them here" />
      </Head>

      <h1 className={styles.title}>{content[0]}</h1>
      <p className={styles.brief}>{content[1]}</p>
      <Link className={styles.homeBtn} href="/">Back to Home</Link>
    </div>
  )

}

export async function getServerSideProps(context) {
  const res = await fetch('http://localhost:3000/api/checkshare', {
    method: 'POST',
    body: JSON.stringify({ uuid: context.params.uuid })
  });
  const returned = await res.json();
  return {
    props: {
      returned
    }
  }
}
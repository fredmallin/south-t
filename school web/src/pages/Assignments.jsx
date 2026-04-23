import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  getDoc
} from "firebase/firestore";
import { db } from "../firebase";

const DEFAULT_FORMS = [
  "Form One",
  "Form Two",
  "Form Three",
  "Form Four"
];

// fallback assignments
const fallbackAssignments = {
  "Form One": [
    { name: "Mathematics", file: "maths1.pdf" },
    { name: "English", file: "form1_english.pdf" }
  ],

  "Form Two": [],
  "Form Three": [],
  "Form Four": []
};

export default function Assignments() {
  const [forms, setForms] = useState(DEFAULT_FORMS);
  const [openForm, setOpenForm] = useState(null);
  const [firestoreData, setFirestoreData] = useState({});

  useEffect(() => {
    fetchFormNames();
    fetchAssignments();
  }, []);

  // Fetch editable form names from Firestore
  const fetchFormNames = async () => {
    try {
      const settingsRef = doc(db, "schoolSettings", "formLevels");
      const settingsSnap = await getDoc(settingsRef);

      if (settingsSnap.exists()) {
        const savedForms = settingsSnap.data().forms || [];

        if (savedForms.length > 0) {
          setForms(savedForms);
        }
      }
    } catch (error) {
      console.error("Failed to fetch form names:", error);
    }
  };

  // Fetch assignments
  const fetchAssignments = async () => {
    try {
      const snap = await getDocs(collection(db, "assignments"));
      const grouped = {};

      snap.docs.forEach((d) => {
        const a = d.data();

        if (!grouped[a.formLevel]) {
          grouped[a.formLevel] = [];
        }

        grouped[a.formLevel].push({
          name: a.subject,
          file: a.fileUrl,
          fileName: a.fileName,
          id: d.id
        });
      });

      setFirestoreData(grouped);
    } catch (error) {
      console.error("Failed to fetch assignments:", error);
    }
  };

  const getData = (form) => {
    if (firestoreData[form] && firestoreData[form].length > 0) {
      return firestoreData[form];
    }

    return fallbackAssignments[form] || [];
  };

  return (
    <main className="assignments">
      <h1>Assignments</h1>

      <div className="form-buttons">
        {forms.map((form) => (
          <div key={form}>
            <button
              onClick={() =>
                setOpenForm(openForm === form ? null : form)
              }
            >
              {form}
            </button>

            {openForm === form && (
              <div className="subjects-container">
                <h2>{form} Assignments</h2>

                <ul>
                  {getData(form).map((subject, i) => (
                    <li key={subject.id || i}>
                      <a
                        href={
                          subject.file?.startsWith("http")
                            ? subject.file
                            : `/pdfs/${subject.file}`
                        }
                        download={!subject.file?.startsWith("http")}
                        target={
                          subject.file?.startsWith("http")
                            ? "_blank"
                            : undefined
                        }
                        rel="noopener noreferrer"
                      >
                        {subject.fileName || subject.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
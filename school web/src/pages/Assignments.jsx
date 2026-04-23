import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const FORMS = ["Form One", "Form Two", "Form Three", "Form Four"];

// Your original hardcoded data as fallback
const fallbackAssignments = {
  "Form One": [
    { name: "Mathematics", file: "maths1.pdf" },
    { name: "English", file: "form1_english.pdf" },
    { name: "Kiswahili", file: "form1_kiswahili.pdf" },
    { name: "Biology", file: "form1_biology.pdf" },
    { name: "Chemistry", file: "form1_chemistry.pdf" },
    { name: "Physics", file: "form1_physics.pdf" },
    { name: "Geography", file: "form1_geography.pdf" },
    { name: "History", file: "form1_history.pdf" },
    { name: "C.R.E", file: "form1_cre.pdf" },
    { name: "I.R.E", file: "form1_ire.pdf" },
    { name: "Computer Studies", file: "form1_computer_studies.pdf" },
    { name: "Business", file: "form1_business.pdf" },
    { name: "Agriculture", file: "form1_agriculture.pdf" },
  ],

  "Form Two": [
    { name: "Mathematics", file: "form2_mathematics.pdf" },
    { name: "English", file: "form2_english.pdf" },
    { name: "Kiswahili", file: "form2_kiswahili.pdf" },
    { name: "Biology", file: "form2_biology.pdf" },
    { name: "Chemistry", file: "form2_chemistry.pdf" },
    { name: "Physics", file: "form2_physics.pdf" },
    { name: "Geography", file: "form2_geography.pdf" },
    { name: "History", file: "form2_history.pdf" },
    { name: "C.R.E", file: "form2_cre.pdf" },
    { name: "I.R.E", file: "form2_ire.pdf" },
    { name: "Computer Studies", file: "form2_computer_studies.pdf" },
    { name: "Business", file: "form2_business.pdf" },
    { name: "Agriculture", file: "form2_agriculture.pdf" },
  ],

  "Form Three": [
    { name: "Mathematics", file: "form3_mathematics.pdf" },
    { name: "English", file: "form3_english.pdf" },
    { name: "Kiswahili", file: "form3_kiswahili.pdf" },
    { name: "Biology", file: "form3_biology.pdf" },
    { name: "Chemistry", file: "form3_chemistry.pdf" },
    { name: "Physics", file: "form3_physics.pdf" },
    { name: "Geography", file: "form3_geography.pdf" },
    { name: "History", file: "form3_history.pdf" },
    { name: "C.R.E", file: "form3_cre.pdf" },
    { name: "I.R.E", file: "form3_ire.pdf" },
    { name: "Computer Studies", file: "form3_computer_studies.pdf" },
    { name: "Business", file: "form3_business.pdf" },
    { name: "Agriculture", file: "form3_agriculture.pdf" },
  ],

  "Form Four": [
    { name: "Mathematics", file: "FORM-4-AUGUST-HOLIDAY-ASSIGNMENT.docx" },
    { name: "English", file: "form4_english.pdf" },
    { name: "Kiswahili", file: "form4_kiswahili.pdf" },
    { name: "Biology", file: "form4_biology.pdf" },
    { name: "Chemistry", file: "form4_chemistry.pdf" },
    { name: "Physics", file: "form4_physics.pdf" },
    { name: "Geography", file: "form4_geography.pdf" },
    { name: "History", file: "form4_history.pdf" },
    { name: "C.R.E", file: "form4_cre.pdf" },
    { name: "I.R.E", file: "form4_ire.pdf" },
    { name: "Computer Studies", file: "form4_computer_studies.pdf" },
    { name: "Business", file: "form4_business.pdf" },
    { name: "Agriculture", file: "form4_agriculture.pdf" },
  ],
};

export default function Assignments() {
  const [openForm, setOpenForm] = useState(null);
  const [firestoreData, setFirestoreData] = useState({});

  useEffect(() => {
    getDocs(collection(db, "assignments")).then((snap) => {
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
          id: d.id,
        });
      });

      setFirestoreData(grouped);
    });
  }, []);

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
        {FORMS.map((form) => (
          <div key={form}>
            {/* Button */}
            <button
              onClick={() =>
                setOpenForm(openForm === form ? null : form)
              }
            >
              {form}
            </button>

            {/* 👇 Assignments now drop directly below clicked form */}
            {openForm === form && (
              <div className="subjects-container">
                <h2>{form} Assignment</h2>

                <ul>
                  {getData(form).map((subject, i) => (
                    <li key={i}>
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
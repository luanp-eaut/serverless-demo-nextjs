import { useCallback, useEffect, useState } from "react";
import { ref, get, update, child } from "firebase/database";
import { firebaseDb } from "@/lib/firebaseConfig";

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);

  const getStudents = useCallback(() => {
    const dbref = ref(firebaseDb);
    get(child(dbref, "students"))
      .then((snapshot) => {
        const result = snapshot.val();
        const data = result.map(
          (v: Omit<Student, "id" | "presence">, i: number) => {
            return { id: i, ...v, presence: true };
          }
        );
        setStudents(data);
      })
      .catch((err) => {
        console.log(err);
        alert("Error occured while getting data!");
      });
  }, []);

  const updateStudent = useCallback((student: Student) => {
    const dbref = ref(firebaseDb);
    const record = `students/${student.id}`;
    get(child(dbref, record))
      .then((snapshot) => {
        if (snapshot.exists()) {
          update(ref(firebaseDb, record), student)
            .then(() => {
              alert("update student successfully");
            })
            .catch((err) => {
              alert("error while updating student");
            });
        } else {
          alert("student doesn't exist!");
        }
      })
      .catch((err) => {
        console.log(err);
        alert("error while selecting student");
      });
  }, []);

  useEffect(() => {
    getStudents();
  }, [getStudents]);

  return { students, setStudents, updateStudent };
};

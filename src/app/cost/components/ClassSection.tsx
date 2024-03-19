import React, { Dispatch, SetStateAction, useState } from "react";
import { ClassType } from "@/src/types/custom/Class";
import lodash from "lodash";

type ClassSectionProps = {
  classes: ClassType[];
  handleDeleteCustomClass: (customClass: ClassType) => void;
  handleAddCustomClass: (newClassName: string) => void;
  onSave: (editedClass: ClassType) => void; // Assuming an onSave handler for persisting changes
};

export const ClassSection = ({
  classes,
  handleDeleteCustomClass,
  handleAddCustomClass,
  onSave,
}: ClassSectionProps) => {
  const initialEditedClasses = classes.reduce(
    (acc, currentClass) => {
      acc[currentClass.id as number] = currentClass;
      return acc;
    },
    {} as { [key: number]: ClassType },
  );

  //https://react.dev/learn/you-might-not-need-an-effect
  const [editClassId, setEditClassId] = useState<number | undefined>(undefined);
  const [editedClasses, setEditedClasses] = useState<{
    [key: number]: ClassType;
  }>(initialEditedClasses);

  const [newClass, setNewClass] = useState<ClassType>({ class_name: "" });
  const [isNewClassBeingCreated, setIsNewClassBeingCreated] =
    useState<boolean>(false);
  const [submitAttempted, setSubmitAttempted] = useState<boolean>(false);

  if (!lodash.isEqual(editedClasses, initialEditedClasses) && !editClassId) {
    setEditedClasses(initialEditedClasses);
  }

  const handleEdit = (classId: number) => {
    setEditClassId(classId);
    setEditedClasses((prev) => ({
      ...prev,
      [classId]: classes.find((c) => c.id === classId) || prev[classId],
    }));
  };

  const handleChange = (classId: number, newClassName: string) => {
    setEditedClasses((prev) => ({
      ...prev,
      [classId]: {
        ...prev[classId],
        class_name: newClassName,
      },
    }));
  };

  const handleSave = (classId: number) => {
    if (onSave && editedClasses[classId]) {
      onSave(editedClasses[classId]);
    }
    setEditClassId(undefined); // Exit edit mode
  };

  return (
    <div>
      {classes.map((classItem) => (
        <div key={classItem.id} className="mb-4 p-2 rounded">
          {classItem.id === editClassId ? (
            <input
              onChange={(e) =>
                handleChange(classItem.id as number, e.target.value)
              }
              value={editedClasses[classItem.id as number]?.class_name}
              className="font-bold"
            />
          ) : (
            <span>{editedClasses[classItem.id as number]?.class_name}</span>
          )}
          {editClassId === classItem.id ? (
            <button
              onClick={() => {
                if (classItem.class_name) {
                  handleSave(classItem.id!);
                }
              }}
            >
              Save
            </button>
          ) : (
            <button onClick={() => handleEdit(classItem.id!)}>Edit</button>
          )}
          <button onClick={() => handleDeleteCustomClass(classItem)}>
            Delete Custom Class
          </button>
        </div>
      ))}
      {isNewClassBeingCreated && (
        <input
          onChange={(e) =>
            setNewClass((prev) => {
              return { ...prev, class_name: e.target.value };
            })
          }
          value={newClass.class_name}
          className="font-bold"
        />
      )}
      {isNewClassBeingCreated ? (
        <>
          <button
            className="mr-10"
            onClick={(e) => {
              setSubmitAttempted(true);
              if (newClass.class_name) {
                handleAddCustomClass(newClass.class_name);
                setIsNewClassBeingCreated(false);
                setNewClass({ class_name: "" });
                setSubmitAttempted(false);
              } else {
              }
            }}
          >
            Create New Class
          </button>
          <button
            onClick={() => {
              setIsNewClassBeingCreated(false);
              setNewClass({ class_name: "" });
              setSubmitAttempted(false);
            }}
          >
            Cancel
          </button>
        </>
      ) : (
        <button
          onClick={() => setIsNewClassBeingCreated(!isNewClassBeingCreated)}
        >
          Add Custom Class
        </button>
      )}
      {submitAttempted && (
        <span className="text-red">Please enter a valid class name</span>
      )}
    </div>
  );
};

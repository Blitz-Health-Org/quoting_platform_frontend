import React, { Dispatch, SetStateAction, useState } from "react";
import { ClassType } from "@/src/types/custom/Class";
import lodash from "lodash";
import { MdEdit, MdDelete, MdSave } from "react-icons/md";

type ClassSectionProps = {
  classes: ClassType[];
  handleDeleteCustomClass: (customClass: ClassType) => void;
  handleAddCustomClass: (newClassName: string) => void;
  onSave: (editedClass: ClassType) => void; // Assuming an onSave handler for persisting changes
  isCustomClassesActivated: boolean;
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

  const [newClass, setNewClass] = useState<ClassType>({
    class_name: "",
    is_default: false,
  });
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
        <div
          key={classItem.id}
          className="mb-2 px-2 py-1 rounded flex justify-between outline outline-1 outline-gray-200 bg-gray-100/20"
        >
          <div>
            {classItem.id === editClassId ? (
              <input
                onChange={(e) =>
                  handleChange(classItem.id as number, e.target.value)
                }
                className="w-4/5"
                value={editedClasses[classItem.id as number]?.class_name}
              />
            ) : (
              <p>{editedClasses[classItem.id as number]?.class_name}</p>
            )}
          </div>
          <div className="flex items-center gap-1">
            {editClassId === classItem.id ? (
              <button
                onClick={() => {
                  if (classItem.class_name) {
                    handleSave(classItem.id!);
                  }
                }}
              >
                <MdSave />
              </button>
            ) : (
              <button onClick={() => handleEdit(classItem.id!)}>
                <MdEdit />
              </button>
            )}
            <button onClick={() => handleDeleteCustomClass(classItem)}>
              <MdDelete />
            </button>
          </div>
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
          className="font-bold border border-black"
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
                setNewClass({ class_name: "", is_default: false });
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
              setNewClass({ class_name: "", is_default: false });
              setSubmitAttempted(false);
            }}
          >
            Cancel
          </button>
        </>
      ) : (
        <button
          onClick={() => setIsNewClassBeingCreated(!isNewClassBeingCreated)}
          className="flex items-center gap-2 outline outline-1 outline-gray-200 px-2 py-1 w-full justify-center rounded-sm bg-gray-100/20 hover:bg-gray-100/50"
        >
          <p>+</p>
          <p>Add Custom Class</p>
        </button>
      )}
      {submitAttempted && (
        <span className="text-red">Please enter a valid class name</span>
      )}
    </div>
  );
};

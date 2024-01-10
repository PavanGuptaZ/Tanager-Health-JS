import { useState } from 'react';
import styles from '../../styles/ProfilePage.module.css';
import { CiSquarePlus } from "react-icons/ci";
import { CiCirclePlus } from "react-icons/ci";
import { PersonIconsIndex } from '../../assets/svgs/persons/PersonIconsIndex';
import { namePattern, relationPattern } from '../../utils/regex';
import { useKey } from '../../hooks/useKey';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { differenceInCalendarYears } from 'date-fns';
import { postPersons } from '../../apis/person/postPersons';

const initialValues = { profileIcon: 0, name: "", relation: "", age: "" }

export const NewPersonBlock = () => {
    const [popUpOptions, setPopUpOptions] = useState({ show: false, focus: "message" })
    const [values, setValues] = useState({ ...initialValues })
    const queryClient = useQueryClient()

    const closeFn = () => {
        setPopUpOptions((prev) => ({ ...prev, show: false }))
        setValues(initialValues)
    }
    useKey('escape', closeFn)
    const AddPersonMutation = useMutation({
        mutationKey: ['addPerson'],
        mutationFn: (variables) => postPersons(variables),
        onSuccess: (data) => {
            if (data?.status === "success") {
                closeFn()
                queryClient.invalidateQueries({ queryKey: ['personList'] })
                toast.info(data.newPerson.name + " is added")
            } else {
                let message = data?.message || "Something went Wrong, try Again"
                toast.warn(message)
            }
        }
    })
    const handleIconSelect = (numb) => {
        setValues((prev) => ({ ...prev, profileIcon: numb }))
    }
    const handleNameChange = (e) => {
        let value = e.target.value.trim();
        if (value.length < 35) {
            setValues((prev) => ({ ...prev, name: value }))
        }
    }
    const handleRelationChange = (e) => {
        let value = e.target.value.trim();
        if (value.length < 15) {
            setValues((prev) => ({ ...prev, relation: value }))
        }
    }

    const handelSubmit = (e) => {
        e.preventDefault()
        console.log("sunvk")
        if (Helper.checks.name && Helper.checks.relation && Helper.checks.age) {
            // if (NameCheck && RelationCheck && AgeCheck) {
            AddPersonMutation.mutate(values)
        } else {
            toast.warn('checks all Values')
        }
    }

    const Helper = {
        message: "Select icon and fill form",
        name: "Name should be one or two words, no extra spacing & between 5 to 30 characters.",
        relation: "between 3 to 10 characters.",
        age: "Age between 1 to 100 characters.",
        checks: {
            message: true,
            name: namePattern.test(values.name.trim()),
            relation: relationPattern.test(values.relation.trim()),
            age: differenceInCalendarYears(Date.now(), values.age) <= 100 && differenceInCalendarYears(Date.now(), values.age) >= 1,
        },
    }
    return (
        <>
            {popUpOptions.show &&
                <div className={styles.AddNewPopup}>
                    <div className={styles.AddNewBox}>
                        <CiCirclePlus className={styles.closeIcon} onClick={closeFn} />
                        <div className={styles.listBox}>
                            {Array.from({ length: 6 }, (_, i) => i + 1).map((num) => {
                                return (
                                    <div key={num} className={styles.selectIcons} onClick={() => handleIconSelect(num)}>
                                        <PersonIconsIndex profileIcon={num} />
                                    </div >
                                )
                            })}
                        </div>
                        <div className={styles.NewDisplayBlock} >
                            <PersonIconsIndex profileIcon={values.profileIcon} />
                            <div className={styles.Name}>
                                {values.name || "Enter Name"}
                            </div>
                            <div className={styles.relation}>
                                {values.relation || "Enter Relation"}
                            </div>
                            <div className={styles.age}>
                                {values.age || "Enter Age"}
                            </div>
                        </div>
                        <form className={styles.NewDetailsBlock} onSubmit={handelSubmit}>
                            <input type="text" name="name" id="" placeholder='Enter Name'
                                onFocus={() => setPopUpOptions((prev) => ({ ...prev, focus: "name" }))}
                                values={values.name} onChange={(e) => handleNameChange(e)}
                            />
                            <input type="text" name="relation" id="" placeholder='Enter Relation'
                                onFocus={() => setPopUpOptions((prev) => ({ ...prev, focus: "relation" }))}
                                values={values.name} onChange={(e) => handleRelationChange(e)}
                            />
                            <input type="date" name="age" min={1} max={100} id="" placeholder='Enter Age'
                                onFocus={() => setPopUpOptions((prev) => ({ ...prev, focus: "age" }))}
                                values={values.name} onChange={(e) => setValues((prev) => ({ ...prev, age: e.target.value }))}
                            />
                            <button type='submit' style={{ height: '35px', minWidth: "100px" }} className='submitBTN'
                                disabled={(!Helper.checks.name && !Helper.checks.relation && !Helper.checks.age) || AddPersonMutation.isPending}>
                                {AddPersonMutation.isPending ? <div className='lds-ellipsis'>
                                    <div></div><div></div><div></div><div></div>
                                </div>
                                    : 'Submit'}
                            </button>
                            <div className={styles.message + " " + (!Helper.checks[popUpOptions.focus] ? styles.red : " ")}>
                                {Helper[popUpOptions.focus]}
                            </div>
                        </form>
                    </div>
                </div>
            }
            <div className={styles.NewPersonBlock} >
                <div style={{ margin: "auto" }} onClick={() => setPopUpOptions((prev) => ({ ...prev, show: true }))}>
                    <CiSquarePlus style={{ fontSize: "5rem", display: "block", margin: "auto" }} />
                    Add New Person
                </div>
            </div>
        </>
    )
}



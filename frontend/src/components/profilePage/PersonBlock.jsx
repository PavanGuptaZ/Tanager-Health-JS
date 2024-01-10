import { PersonIconsIndex } from '../../assets/svgs/persons/PersonIconsIndex';
import styles from '../../styles/ProfilePage.module.css';
import PropTypes from 'prop-types';
import { differenceInCalendarYears } from 'date-fns';

export const PersonBlock = ({ data }) => {
    console.log(data)
    return (
        <div className={styles.PersonBlock}>
            <div className={styles.PersonIcon}>
                <PersonIconsIndex profileIcon={data.profileIcon} />
            </div>
            <div className={styles.Name}>
                {data.name}
            </div>
            <div className={styles.relation}>
                {data.relation}
            </div>
            <div className={styles.age}>
                {differenceInCalendarYears(Date.now(), data.dateOfBirth)}
            </div>
        </div>
    )
}
PersonBlock.propTypes = {
    data: PropTypes.object
}
import styles from '../styles/ProfilePage.module.css';
import { NewPersonBlock } from '../components/profilePage/NewPersonBlock.jsx';
import { Heading } from '../components/Heading.jsx'
import { useGetUser } from '../hooks';
import { PersonBlock } from '../components/profilePage/PersonBlock.jsx';
import { UserIconsIndex } from '../assets/svgs/users/UserIconsIndex.jsx'
import { useQuery } from '@tanstack/react-query';
import { getPersonsList } from '../apis/person/getPersons.js';
import { LoadingComponent } from '../components/LoadingComponent.jsx';


export const ProfilePage = () => {
    const user = useGetUser()

    const PersonQuery = useQuery({
        queryKey: ['personList'],
        queryFn: () => getPersonsList(),
        enabled: !!user
    })
    return (
        <div className={styles.ProfilePageBox + " widthControl"}>
            <div className={styles.ProfileHead}>
                <div className={styles.ProfilePictureBox}>
                    <UserIconsIndex />
                </div>
                <div className={styles.asideDeatils}>
                    <div className={styles.header}>
                        <div className={styles.name}>
                            {user.name}
                        </div>
                    </div>
                    <div className={styles.DetailsBox}>
                        <div className={styles.Details}>
                            <span className={styles.sideHead}>{user.role.toUpperCase() + " ID"}</span>
                            <span>{"- " + user._id}</span>
                        </div>
                        <div className={styles.Details}>
                            <span className={styles.sideHead}>EMAIL ID</span>
                            <span>{"- " + user.email}</span>
                        </div>
                        <div className={styles.Details}>
                            <span className={styles.sideHead}>Joined On</span>
                            <span>{"- " + user.createdAt}</span>
                        </div>
                        <div className={styles.Details}>
                            <span className={styles.sideHead}>Phone</span>
                            <span>{"- " + user.phone}</span>
                        </div>
                        <div className={styles.Details}>
                            <span className={styles.sideHead}>Address</span>
                            <span> - Lorem ipsum, dolor sit amet consectetur adipisicing elit. Reiciendis veniam error necessitatibus, earum nisi magni maxime qui harum culpa </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.personsListBox}>
                <Heading text='Persons list' size={1.5} />
                <div className={styles.personsList}>
                    {PersonQuery.data?.status === 'success' &&
                        PersonQuery.data.list.map((ele) => {
                            return <PersonBlock key={ele._id} data={ele} />
                        })}
                    <NewPersonBlock />
                    {PersonQuery.isFetching && <div className={styles.loadingBox}>
                        <LoadingComponent />
                    </div>}
                </div>
            </div>
        </div>
    )
}

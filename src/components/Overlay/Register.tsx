import { useClient } from '@/contexts/ClientContext';
import { useDispatch } from 'react-redux';
import { useRef, useEffect } from 'react';
import { Overlay, setOverlay } from '@/store/reducer/context';
import { toast } from 'react-toastify';

import styles from '@/styles/login.module.css';

export default function Register({
    visible
}: {
    visible: boolean;
}) {
    const { client, ready } = useClient();

    const dispatch = useDispatch();

    const username = useRef<HTMLInputElement>(null);

    const email = useRef<HTMLInputElement>(null);

    const password = useRef<HTMLInputElement>(null);

    const handleRegister = () => {
        if (!client || !ready)
            return;

        if (!username.current || !email.current || !password.current)
            return;

        client.user.register(username.current.value, email.current.value, password.current.value);
    }

    const handleLogin = () => {
        dispatch(setOverlay(Overlay.Login));
    }

    useEffect(() => {
        if (!client || !ready)
            return;

        const listeners = [
            client.user.on('register', token => {
                toast.success('Your account has been created successfully. Please verify your email address to continue.');
            })
        ];

        return () => {
            listeners.forEach(listener => client.user.off(listener));
        }
    }, [client, ready]);

    return (
        <div className={`${styles.container} ${visible ? styles.active : ''}`}>
            <div className={styles.title}>
                Register
            </div>
            <div className={styles.description}>
                Get Started!
            </div>
            <div className={styles.separator}></div>
            <div className={styles.input}>
                <div className={styles.name}>
                    Username
                </div>
                <input ref={username} type="text" placeholder='admin' />
            </div>
            <div className={styles.input}>
                <div className={styles.name}>
                    E - Mail
                </div>
                <input ref={email} type="text" placeholder='admin@getwave.gg' />
            </div>
            <div className={styles.input}>
                <div className={styles.name}>
                    Password
                </div>
                <input ref={password} type="password" placeholder='********' />
            </div>
            <div className={styles.separator}></div>
            <div className={styles.button} onClick={handleRegister}>
                Sign Up
            </div>
            <div className={styles.bottom}>
                <div>
                    <span>
                        <span>
                            Already have an account?&nbsp;
                        </span>
                        <span className={styles.blue} onClick={handleLogin}>
                            Sign In
                        </span>
                    </span>
                </div>
            </div>
            <div className={styles.frame151}></div>
        </div>
    );
}
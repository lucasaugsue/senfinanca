import React from 'react';
import styles from './Header.module.css';

export default function Header({transparent : transparentProps = true}){
    const [scrollPosition, setScrollPosition] = React.useState(0);
    const [transparent, setTransparent] = React.useState(false);

    const handleScroll = e => {
        setScrollPosition(document.documentElement.scrollTop)
    }

    React.useEffect(() => {
        setTransparent(scrollPosition <= 100)
    }, [scrollPosition])

    React.useEffect(() => {
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return <div>
        <div className={
            transparent
            ? styles.basicHeaderTransparent
            : styles.basicHeader
        }>
            <div className={styles.gridContainerLogo}>
                <div className={styles.itemLogo}>
                    {"Sen Finança".split("")
                    .map((letra, index) => <div 
                        className={styles.logo}
                        key={`${letra};;${index}`}
                        // onClick={() => {
                        //     window.location.href=`#inicio`
                        // }} 
                    >
                        {letra}
                    </div>)}
                </div>
            </div>
        </div>
    </div> 
}

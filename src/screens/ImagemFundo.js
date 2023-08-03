import React from 'react'
import styles from './ImagemFundo.module.css'


export default function ImagemFundo(){
    const [scrollPosition, setScrollPosition] = React.useState(0);
    const [scroll, setScroll] = React.useState(false);

    const handleScroll = e => {
        setScrollPosition(document.documentElement.scrollTop)
    }

    React.useEffect(() => {
        setScroll(scrollPosition <= 100)
    }, [scrollPosition])

    React.useEffect(() => {
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const textRotate = () => {
        let deg = 6;
        let frase = "Controle financeiro"

        return (
            <div className={
                scroll
                ? styles.containerRotate
                : styles.containerRotateScroling
            }>
                {frase.split("").map((letra, index) => {
                    deg = 8.5 * (index + 1)

                    return <div 
                        key={`${letra};;${index}`}
                        style={{
                            transform: 'rotate(' + deg + 'deg)'
                        }}
                    >{letra}</div>
                })}
            </div>
        )
    }

    return <section className={styles.container} id="inicio">
        <div className={styles.image}/>
        
        <div className={styles.divText}>
            <div className={styles.text}>
                {textRotate()}
            </div>
        </div>
    </section> 
}

import Menu from '@mui/icons-material/Menu';
import { Collapse, List, ListItemButton, ListItemText } from '@mui/material';
import React from 'react';
import styles from './Header.module.css';

export default function Header({transparent : transparentProps = true}){
    const [scrollPosition, setScrollPosition] = React.useState(0);
    const [transparent, setTransparent] = React.useState(false);
    const [open, setOpen] = React.useState(false)

    const listItens = [
        {id: 1, title: "Início", section: "#inicio"},
        {id: 2, title: "Vamos nos casar", section: "#vamos-casar"},
        {id: 3, title: "Confirme sua presença", section: "#confirmar-presenca"},
        {id: 4, title: "Localização", section: "#local"},
        {id: 5, title: "Escreva um recado", section: "#recado"},
    ]

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
                        onClick={() => {
                            setOpen(false)
                            window.location.href=`#inicio`
                        }} 
                    >
                        {letra}
                    </div>)}
                </div>
                <div/>
                <div 
                    className={styles.itemIcon}
                    onClick={() => setOpen(!open)} 
                >
                    <Menu className={styles.icon}/>
                </div>
            </div>
            <Collapse 
                in={open}
                timeout="auto" 
                unmountOnExit
                className={styles.collapse}  
            >
                <List 
                    component="div" 
                    disablePadding
                    className={styles.list} 
                >
                    {listItens.map((i, index) => 
                    <ListItemButton 
                        sx={{ pl: 3 }}
                        key={`${i.id};;${index}`}
                        onClick={() => {
                            setOpen(false)
                            window.location.href=`${i.section}`
                        }}
                    >
                        <ListItemText primary={i.title} />
                    </ListItemButton>)}
                </List>
            </Collapse>
        </div>
    </div> 
}

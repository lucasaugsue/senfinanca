import { showNotification } from '@mantine/notifications';
import { Delete, Edit } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, IconButton, MenuItem, Select, TableBody, TableCell, TableHead, TableRow, TextField, Tooltip } from '@mui/material';
import Table from '@mui/material/Table';
import moment from 'moment';
import React from 'react';
import FiancaContext from "../context/FiancaContext";
import styles from './TabelaFinancias.module.css';
import { ReportsDashPaper } from '../components/ReportsDashPaper';


export default function TabelaFinancias(){
    const { currentFianca, changeList } = React.useContext(FiancaContext);

    const [data, setData] = React.useState({});
    const [open, setOpen] = React.useState(false);
    const [edit, setEdit] = React.useState(false);
    
    const [text, setText] = React.useState("")
    const [rows, setRows] = React.useState(currentFianca ? [...currentFianca] : []);

    //filtro por título
    var rowsFilteredByTitle = text.length > 1
    ? rows.filter((i) =>
        i.titulo.toLowerCase().includes(text.toLowerCase())
      )
    : rows;

    // let totalConsumation = wr.user_consummations.reduce((pv, v) => pv + v.amount, 0);

    // let balance = rows.reduce((pv, v) => {
    //     pv = 0
    //     if(pv.tipo === "Ganhos") pv + parseInt(v.valor)
    //     return pv
    // }, 0)

    // console.log("balance", balance)

    // var financialData = rows.reduce((curr, obj) => {
    //     let balance = 0
    //     let spending = 0
    //     let sum = 0

    //     if(curr.tipo === "Ganhos") balance = balance + curr.valor
    //     else spending

    //     return obj
    // }, {
    //     balance: 0,
    //     spending: 0,
    //     sum: 0
    // })

    const tipos = [
        {id: 1, nome: "Ganhos"},
        {id: 2, nome: "Despesas"}
    ]

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setData({})
        setOpen(false);
    };

    const handleChange = (e) => setData(params => ({
        ...params,
        [e.target.name]: e.target.value
    }))

    const handleTransactionRegistration = () => {
        try{
            if(!data.titulo) throw new Error("É necessário o titulo!")
            if(!data.tipo) throw new Error("É necessário o tipo!")
            if(!data.categoria) throw new Error("É necessário a categoria!")
            if(!data.valor) throw new Error("É necessário o valor!")
    
            let tmp = [...rows, {
                ...data, 
                data: moment().format("YYYY-MM-DD HH:MM:ss")
            }]

            setRows([...tmp])
            changeList([...tmp])

            handleClose()
            showNotification({message: "Transação registrada!", color: 'green', autoClose: true})

        }catch(err) {
            showNotification({message: err.message, color: 'red', autoClose: true})
        }

    }

    const handleTransactionDelete = (params) => {
        let tmp = [...rows]
        tmp = tmp.filter(i => i.data !== params.data)

        setRows([...tmp])
        changeList([...tmp])

        showNotification({message: "Transação deletada!", color: 'green', autoClose: true})
    }

    const handleTransactionEdit = () => {
        let tmp = [...rows]
        tmp = [
            ...tmp.filter(i => i.data !== data.data),
            {...data}
        ]

        setRows([...tmp])
        changeList([...tmp])

        handleClose()
        showNotification({message: "Alterações salvas!", color: 'green', autoClose: true})
    }
    
    return <section className={styles.container} id="tabela-financias">

        <Grid style={{marginTop:'4vh'}} container spacing={2}>
            <Grid item xs={4}>
                <ReportsDashPaper 
                    noButton={true}
                    title={"Saldo"} 
                    background={"#64b084"} 
                    bodySubtitle={"Total do saldo"}
                    onClickFunction={() => {console.log("ainda a definir 1")}}
                />
            </Grid>
            <Grid item xs={4}>
                <ReportsDashPaper 
                    noButton={true}
                    title={"Gastos"} 
                    background={"#eb5757"} 
                    bodySubtitle={"Total dos gastos"}
                    onClickFunction={() => {console.log("ainda a definir 2")}}
                />
            </Grid>
            <Grid item xs={4}>
                <ReportsDashPaper 
                    noButton={true}
                    title={"Somatória"} 
                    background={"#057dc1"} 
                    bodySubtitle={"Total do saldo e gasto"}
                    onClickFunction={() => {console.log("ainda a definir 3")}}
                />
            </Grid>

            <Grid item xs={12}>
                <div className={styles.whiteBox}>
                    <Grid style={{marginTop:'1vh'}} container spacing={2}>
                        <Grid item xs={8}>
                            <TextField
                                fullWidth
                                type="text"
                                value={text}
                                name="titulo"
                                variant="outlined"
                                label="Busca de título"
                                onChange={(e) => setText(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={4}>
                            <Button
                                fullWidth
                                variant="contained" 
                                startIcon={<AddIcon />}
                                onClick={() => {
                                    setData({...data, tipo: "Despesas"})
                                    handleClickOpen()
                                }} 
                            >
                                Cadastrar Transação
                            </Button>
                        </Grid>
                    </Grid>

                    <Table>
                        <TableHead>
                        <TableRow>
                            <TableCell>Título</TableCell>
                            <TableCell align="center">Tipo</TableCell>
                            <TableCell align="center">Categoria</TableCell>
                            <TableCell align="center">Valor</TableCell>
                            <TableCell align="center">Data</TableCell>
                            <TableCell align="center">Editar</TableCell>
                            <TableCell align="center">Deletar</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                            {rowsFilteredByTitle
                            .map((row) => (
                                <TableRow
                                key={row.titulo}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                <TableCell component="th" scope="row">
                                    {row.titulo}
                                </TableCell>
                                <TableCell align="center">{row.tipo}</TableCell>
                                <TableCell align="center">{row.categoria}</TableCell>
                                <TableCell align="center">{row.valor}</TableCell>
                                <TableCell align="center">{row.data}</TableCell>
                                <TableCell align="center">
                                    <Tooltip title="Editar">
                                        <IconButton onClick={() => {
                                                setEdit(true) 
                                                setData({...row})
                                                handleClickOpen()
                                            }}
                                        >
                                            <Edit fontSize="medium" />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                                <TableCell align="center">
                                    <Tooltip title="Deletar">
                                        <IconButton onClick={() => handleTransactionDelete(row)}>
                                            <Delete fontSize="medium" />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Grid>
        </Grid>
        

        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
            {edit ? "Editar transação" : "Cadastro de transação"}
            </DialogTitle>
            <DialogContent>

                <Grid style={{marginTop:'1vh'}} container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            type="text"
                            name="titulo"
                            variant="outlined"
                            label="Título"
                            value={{...data}.titulo}
                            onChange={(e) => handleChange(e)}
                        />
                    </Grid>
                    <Grid item xs={6}>

                        <FormControl
                            fullWidth
                            variant="outlined"
                        >
                            <Select
                                fullWidth
                                defaultValue="Despesas"
                                value={{...data}.tipo}
                                onChange={(e) => setData({
                                    ...data,
                                    tipo: e.target.value
                                })}
                            >
                                {tipos.map((item, index) => 
                                    <MenuItem 
                                        key={`${item.id};;${index}`}
                                        value={item.nome}
                                    > {item.nome} </MenuItem> 
                                )}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            type="text"
                            name="categoria"
                            variant="outlined"
                            label="Categoria"
                            value={{...data}.categoria}
                            onChange={(e) => handleChange(e)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            type="number"
                            name="valor"
                            variant="outlined"
                            label="Valor"
                            value={{...data}.valor}
                            onChange={(e) => handleChange(e)}
                        />
                    </Grid>
                </Grid>


            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose}>Fechar</Button>
            <Button autoFocus onClick={
                edit
                ? () => handleTransactionEdit()
                : () => handleTransactionRegistration()
            }>
                {edit ? "Editar" : "Cadastrar"}
            </Button>
            </DialogActions>
        </Dialog>

    </section> 
}

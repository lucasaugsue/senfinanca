import { showNotification } from '@mantine/notifications';
import { Delete, Edit } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, IconButton, MenuItem, Select, TableBody, TableCell, TableHead, TableRow, TextField, Tooltip } from '@mui/material';
import Table from '@mui/material/Table';
import moment from 'moment';
import React from 'react';
import { ReportsDashPaper } from '../components/ReportsDashPaper';
import FiancaContext from "../context/FiancaContext";
import { formatCurrency } from '../util/Util';
import styles from './TabelaFinancias.module.css';


export default function TabelaFinancias(){
    const { currentFianca, changeList } = React.useContext(FiancaContext);

    const [data, setData] = React.useState({});
    const [open, setOpen] = React.useState(false);
    const [edit, setEdit] = React.useState(false);
    
    const [text, setText] = React.useState("")
    const [selectValue, setSelectValue] = React.useState("Todos")
    const [rows, setRows] = React.useState(currentFianca ? [...currentFianca] : []);
    const [rowsFiltered, setRowsFiltered] = React.useState([]);
    
    const [financialData, setFinancialData] = React.useState({
        balance: 0,
        spending: 0,
        sum: 0
    })

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setData({})
        setEdit(false)
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

    const getFinancialData = () => {
        const balance = rows.filter(i => i.tipo === "Ganhos")
        .reduce((pv, v) => pv + parseFloat(v.valor), 0)

        const spending = rows.filter(i => i.tipo === "Despesas")
        .reduce((pv, v) => pv + parseFloat(v.valor), 0)

        const sum = balance - spending

        setFinancialData({balance, spending, sum})
    }

    const getRowsFiltered = () => {
        //filtro por título
        var rowsFilteredByTitle = text.length > 1
        ? rows.filter((i) =>
            i.titulo.toLowerCase().includes(text.toLowerCase())
        )
        : rows;

        //filtro por tipo
        var rowsFilteredByType = selectValue !== "Todos"
        ? rowsFilteredByTitle.filter((i) => i.tipo === selectValue)
        : rowsFilteredByTitle;

        setRowsFiltered([...rowsFilteredByType])
    }

    React.useEffect(() => {
        getFinancialData()
    }, [rows])

    React.useEffect(() => {
        getRowsFiltered()
    }, [selectValue, text])
    
    return <section className={styles.container} id="tabela-financias">

        <Grid style={{marginTop:'4vh'}} container spacing={2}>
            <Grid item xs={4}>
                <ReportsDashPaper 
                    title={"Saldo"} 
                    background={"#64b084"} 
                    bodyTitle={formatCurrency(financialData.balance)}
                    bodySubtitle={"Total do saldo"} 
                />
            </Grid>
            <Grid item xs={4}>
                <ReportsDashPaper 
                    title={"Gastos"} 
                    background={"#eb5757"} 
                    bodyTitle={formatCurrency(financialData.spending)}
                    bodySubtitle={"Total dos gastos"} 
                />
            </Grid>
            <Grid item xs={4}>
                <ReportsDashPaper 
                    title={"Somatória"} 
                    background={"#057dc1"}
                    bodyTitle={formatCurrency(financialData.sum)}
                    bodySubtitle={"Total do saldo e gasto"} 
                />
            </Grid>

            <Grid item xs={12}>
                <div className={styles.whiteBox}>
                    <Grid style={{marginTop:'1vh'}} container spacing={2}>
                        <Grid item xs={7}>
                            <TextField
                                fullWidth
                                type="text"
                                value={text}
                                name="titulo"
                                variant="outlined"
                                label="Busca por título"
                                onChange={(e) => setText(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={3}>
                            <FormControl
                                fullWidth
                                variant="outlined"
                            >
                                <Select
                                    fullWidth
                                    defaultValue="Todos"
                                    value={selectValue}
                                    onChange={(e) => setSelectValue(e.target.value)}
                                >
                                    {[
                                        {id: 1, nome: "Todos"},
                                        {id: 2, nome: "Ganhos"},
                                        {id: 3, nome: "Despesas"}
                                    ].map((item, index) => 
                                        <MenuItem 
                                            key={`${item.id};;${index}`}
                                            value={item.nome}
                                        > {item.nome} </MenuItem> 
                                    )}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={2}>
                            <Button
                                fullWidth
                                variant="contained" 
                                startIcon={<AddIcon />}
                                className={styles.TransactionRegistration}
                                // style={{padding: "1.5vh"}}
                                onClick={() => {
                                    setData({...data, tipo: "Despesas"})
                                    handleClickOpen()
                                }} 
                            >
                                Cadastrar Transação
                            </Button>
                        </Grid>
                    </Grid>

                    <Table style={{marginTop:'2vh'}}>
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
                            {rowsFiltered
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
                                {[
                                    {id: 1, nome: "Ganhos"},
                                    {id: 2, nome: "Despesas"}
                                ].map((item, index) => 
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

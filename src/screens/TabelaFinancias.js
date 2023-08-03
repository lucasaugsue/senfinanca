import { showNotification } from '@mantine/notifications';
import { Delete, Edit } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, TextField, Tooltip, tableCellClasses } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import { styled } from '@mui/material/styles';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { ReportsDashPaper } from '../components/ReportsDashPaper';
import TablePaginationActions from "../components/TablePaginationActionsComponent";
import FiancaContext from "../context/FiancaContext";
import { formatCurrency } from '../util/Util';
import styles from './TabelaFinancias.module.css';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
}));

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

export default function TabelaFinancias(){
    const { currentFianca, changeList } = React.useContext(FiancaContext);

    const [data, setData] = React.useState({});
    const [open, setOpen] = React.useState(false);
    const [edit, setEdit] = React.useState(false);
    
    const [text, setText] = React.useState("")
    const [selectValueType, setSelectValueType] = React.useState("Todos")
    const [selectValueCategory, setSelectValueCategory] = React.useState("Todos")

    const [rows, setRows] = React.useState(currentFianca ? [...currentFianca] : []);
    const [rowsFiltered, setRowsFiltered] = React.useState([]);

    //início relacionado ao passar página
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rowsFiltered.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    //fim relacionado ao passar página

    
    const [financialData, setFinancialData] = React.useState({
        balance: 0,
        spending: 0,
        sum: 0
    })

    const listCategory = [
        {id: 1, nome: "Todos"},
        {id: 2, nome: "Lazer"},
        {id: 3, nome: "Transporte"},
        {id: 4, nome: "Educação"},
        {id: 5, nome: "Comida"},
        {id: 6, nome: "Trabalho"},
        {id: 7, nome: "Outros"},
    ]

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
                data: moment().format("YYYY-MM-DD HH:mm:ss")
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
        var rowsFilteredByType = selectValueType !== "Todos"
        ? rowsFilteredByTitle.filter((i) => i.tipo === selectValueType)
        : rowsFilteredByTitle;

        //filtro por categoria
        var rowsFilteredByCategory = selectValueCategory !== "Todos"
        ? rowsFilteredByType.filter((i) => i.categoria === selectValueCategory)
        : rowsFilteredByType;

        setRowsFiltered([
            ...rowsFilteredByCategory.sort((a,b) => a.data < b.data ? 1 : -1)
        ])
    }

    React.useEffect(() => {
        getFinancialData()
        // eslint-disable-next-line
    }, [rows])

    React.useEffect(() => {
        getRowsFiltered()
        // eslint-disable-next-line
    }, [rows, selectValueType, selectValueCategory, text])
    
    return <section className={styles.container} id="tabela-financias">

        <Grid style={{marginTop:'3vh'}} container spacing={2}>
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
                        <Grid item xs={4}>
                            <TextField
                                fullWidth
                                type="text"
                                value={text}
                                name="titulo"
                                variant="outlined"
                                label="Busca por título"
                                defaultValue=""
                                onChange={(e) => setText(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={3}>
                            <FormControl
                                fullWidth
                                variant="outlined"
                            >
                                <InputLabel>Categoria</InputLabel>
                                <Select
                                    fullWidth
                                    label="Categoria"
                                    defaultValue="Todos"
                                    value={selectValueCategory}
                                    onChange={(e) => setSelectValueCategory(e.target.value)}
                                >
                                    {listCategory.map((item, index) => 
                                        <MenuItem 
                                            key={`${item.id};;${index}`}
                                            value={item.nome}
                                        > {item.nome} </MenuItem> 
                                    )}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={3}>
                            <FormControl
                                fullWidth
                                variant="outlined"
                            >
                                <InputLabel>Tipo</InputLabel>
                                <Select
                                    fullWidth
                                    label="Tipo"
                                    defaultValue="Todos"
                                    value={selectValueType}
                                    onChange={(e) => setSelectValueType(e.target.value)}
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
                                className={styles.buttontr}
                                onClick={() => {
                                    handleClickOpen()
                                }} 
                            >
                                Cadastrar Transação
                            </Button>
                        </Grid>
                    </Grid>


                    <TableContainer style={{margin: "3vh", minHeight: '50vh'}} component={Paper}>
                        <Table style={{width: "100%"}} aria-label="custom pagination table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Título</StyledTableCell>
                                    <StyledTableCell align="center">Tipo</StyledTableCell>
                                    <StyledTableCell align="center">Categoria</StyledTableCell>
                                    <StyledTableCell align="center">Valor</StyledTableCell>
                                    <StyledTableCell align="center">Data</StyledTableCell>
                                    <StyledTableCell align="center">Editar</StyledTableCell>
                                    <StyledTableCell align="center">Deletar</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    (rowsPerPage > 0
                                        ? rowsFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        : rowsFiltered
                                    ).map((row) => (
                                    <StyledTableRow
                                        key={row.titulo}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                    <StyledTableCell component="th" scope="row"> {row.titulo} </StyledTableCell>
                                    <StyledTableCell align="center">{row.tipo}</StyledTableCell>
                                    <StyledTableCell align="center">{row.categoria}</StyledTableCell>
                                    <StyledTableCell align="center">{formatCurrency(row.valor)}</StyledTableCell>
                                    <StyledTableCell align="center">{row.data}</StyledTableCell>
                                    <StyledTableCell align="center">
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
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Tooltip title="Deletar">
                                            <IconButton onClick={() => handleTransactionDelete(row)}>
                                                <Delete fontSize="medium" />
                                            </IconButton>
                                        </Tooltip>
                                    </StyledTableCell>
                                    </StyledTableRow>
                                ))}
                                {emptyRows > 0 && (
                                    <StyledTableRow style={{ height: 73 * emptyRows }}>
                                        <StyledTableCell colSpan={6} />
                                    </StyledTableRow>
                                )}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                        colSpan={7}
                                        count={rowsFiltered.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        SelectProps={{
                                            inputProps: {
                                            'aria-label': 'rows per page',
                                            },
                                            native: true,
                                        }}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                        ActionsComponent={TablePaginationActions}
                                    />
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>
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
                    <Grid item xs={6}>

                        <FormControl
                            fullWidth
                            variant="outlined"
                        >
                            <InputLabel>Tipo</InputLabel>
                            <Select
                                fullWidth
                                defaultValue=""
                                name="tipo"
                                label="Tipo"
                                value={{...data}.tipo}
                                onChange={(e) => handleChange(e)}
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
                        <FormControl
                            fullWidth
                            variant="outlined"
                        >
                            <InputLabel>Categoria</InputLabel>
                            <Select
                                fullWidth
                                defaultValue=""
                                name="categoria"
                                label="Categoria"
                                value={{...data}.categoria}
                                onChange={(e) => handleChange(e)}
                            >
                                {listCategory.filter(i => i.nome !== "Todos")
                                .map((item, index) => 
                                    <MenuItem 
                                        key={`${item.id};;${index}`}
                                        value={item.nome}
                                    > {item.nome} </MenuItem> 
                                )}
                            </Select>
                        </FormControl>
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

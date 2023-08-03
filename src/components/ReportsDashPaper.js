import { Grid, Paper } from "@mui/material";

export const ReportsDashPaper = ({
	title, bodyTitle, bodySubtitle, background,
	}) => {
		
    return(
    <div style={{padding: 0}}>
        <Paper 
			style={{
				margin:"2.25%",
				cursor: 'pointer',
				borderRadius: '2px',
				opacity: 1
			}} 
		>
            <div 
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					backgroundColor: `${background}`,
					color: '#FAFAFA',
					padding: '10px 10px',
					borderRadius: '2px 2px 0 0'
				}}
			>
                <Grid container direction='row' style={{padding: 3}} xs={12} spacing={1}>
					<Grid item xs={12} sm={12} md={6}>
						<div style={{
							textAlign: 'left',
							fontWeight: 'bold',
							fontSize: 26
						}}> 
							{title} 
						</div>
					</Grid>
				</Grid>
            </div>
            <div 
				style={{
					padding: 5,
					fontSize: 12,
					color: '#FAFAFA',
					lineHeight: 1.33,
					fontWeight: '200',
					borderRadius: '0 0 2px 2px',
					background: `${background}E0`
				}}
			>
                <Grid container direction='row' style={{padding: 15}} xs={12} spacing={1}>
					<Grid item xs={12} sm={12} md={6}></Grid>
					<Grid item xs={12} sm={12} md={6}>
                    	<div style={{textAlign: 'right', fontSize: 20}}> {bodySubtitle} </div>
					</Grid>
					<Grid item xs={12} sm={12} md={6}></Grid>
					<Grid item xs={12} sm={12} md={6}>
                    	<div style={{textAlign: 'right', fontSize: 34, fontWeight: 'bold'}}> {bodyTitle} </div>
					</Grid>
                </Grid>
            </div>
        </Paper>
    </div>
)}
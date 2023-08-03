import React from "react";
import { Button, Grid, Paper } from "@mui/material";

export const ReportsDashPaper = ({
	onClickFunction, title,
	bodyTitle, bodySubtitle,
	disabled, background, id,
	bodyButton, iconButton, noButton
	}) => {
    return(
    <div style={{padding: 0}}>
        <Paper 
			onClick={() => {onClickFunction(id)}}
			style={{
				margin:"2.25%",
				cursor: 'pointer',
				borderRadius: '2px',
				opacity: disabled ? 0.3 : 1
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
                <Grid container direction='row' style={{padding: 3}} xs={12} sm={12} md={12} spacing={1}>
					<Grid item xs={12} sm={12} md={6}>
						<div style={{
							textAlign: 'left',
							fontWeight: 'bold',
							fontSize: 22
						}}> 
							{title} 
						</div>
					</Grid>
				</Grid>

                {/* <div>
                    <span style={{verticalAlign: 'middle', fontWeight: 'bold', fontSize: 22}}>{title}</span>
                </div> */}
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
                <Grid container direction='row' style={{padding: 15}} xs={12} sm={12} md={12} spacing={1}>
					<Grid item xs={12} sm={12} md={8}></Grid>
					<Grid item xs={12} sm={12} md={4}>
                    	<div style={{textAlign: 'right', fontSize: 16}}> {bodySubtitle} </div>
					</Grid>
					<Grid item xs={12} sm={12} md={5}>
						{
							noButton
							? <div></div>
							: <Button
								fullWidth
								variant="outlined"
								onClick={() => {onClickFunction(id)}}
								endIcon={iconButton}
								style={{
									width: '90%',
									maxWidth: 250,
									color: 'white',
									marginTop: '3%',
									fontWeight: 'bold',
									borderColor: 'white',
								}}
							>
								{bodyButton}
							</Button>

						}
					</Grid>
					<Grid item xs={12} sm={12} md={1}></Grid>
					<Grid item xs={12} sm={12} md={6}>
                    	<div style={{textAlign: 'right', fontSize: 34, fontWeight: 'bold'}}> {bodyTitle} </div>
					</Grid>
                </Grid>
            </div>
        </Paper>
    </div>
)}
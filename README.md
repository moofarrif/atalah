# Atalah Curve — Gestational Nutritional Assessment

Web tool for nutritionists to locate pregnant patients on the Atalah BMI curve based on gestational age.

## Features

- Calculates BMI from weight and height
- Calculates gestational weeks from Last Menstrual Period (LMP)
- Plots the patient on an interactive Atalah curve chart
- Returns nutritional diagnosis: **Underweight**, **Adequate BMI**, **Overweight**, or **Obese**

## Standard

Atalah et al. curve (*Rev Med Chile*, 1997), adopted by the Chilean Ministry of Health (MINSAL). Covers gestational weeks 10–42.

## Usage

1. Enter **LMP date** to auto-calculate gestational weeks (or enter weeks manually)
2. Enter **weight** (kg) and **height** (meters or cm — auto-detected)
3. Click **Calcular y ubicar en curva**
4. Red dot appears in the corresponding zone on the chart

## Stack

- HTML5 / CSS3 / Vanilla JavaScript
- [Chart.js 4.4.7](https://www.chartjs.org/)

## Demo

https://atalah.vercel.app

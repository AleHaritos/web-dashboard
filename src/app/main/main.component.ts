import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, BarController, BarElement, Tooltip } from 'chart.js'

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  show: boolean = false
  chart: any
  visible: string = 'notVisible'

  forms: FormGroup = new FormGroup({
    valorInicial: new FormControl(null, [Validators.required, Validators.pattern('[0-9]+.[0-9]+')]),
    otimista: new FormControl(null, [Validators.required, Validators.pattern('^-?[0-9]+(\.[0-9]{2})?%$')]),
    pessimista: new FormControl(null, [ Validators.required, Validators.pattern('^-?[0-9]+(\.[0-9]{2})?%$')]),
    type: new FormControl(null, [Validators.required])
  })

types: any[] = [
  { label: 'Em Linhas' , value: 'line'},
  { label: 'Em Barras' , value: 'bar'}
]
  constructor( ) { }
  @ViewChild("canvas", { static: true }) elemento!: ElementRef
  ngOnInit(): void {
   
  }


gerarGrafico(otimista: number[], pessimista: number[]): void {
  const ctx = "myChart"

  const config = {
    type: this.forms.value.type,
    data: {
      labels: ['1° mês', '2° mês', '3° mês', '4° mês', '5° mês', '6° mês', '7° mês', '8° mês', '9° mês', '10° mês', '11° mês', '12° mês'],
      datasets: [
        {
          label: 'Otimista',
          data: otimista,
          fill: false,
          borderColor: '#c2185b',
          backgroundColor: '#c2185b',
          pointStyle: 'triangle',
          pointRadius: 6,
        },
        {
          label: 'Pessimista',
          data: pessimista,
          fill: false,
          borderColor: '#d9d9d9',
          backgroundColor: '#d9d9d9',
          pointStyle: 'circle',
          pointRadius: 6,
        }
        
      ]
    },
    options: {  
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: true,
        mode: 'index',
      },
      plugins: {
        title: {
          display: true,
          text: 'Gráfico de investimentos', 
        }
      },
      tooltip: {
        usePointStyle: true,
      }
  }

  }

  this.show = true
  this.visible = 'visible'
  Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, BarController, BarElement, Tooltip)
  this.chart =  new Chart(ctx, config)
  
}

calculo(): void {
  if(this.forms.valid) {
    
    const valorInicial = parseFloat(this.forms.value.valorInicial)
    const porcentagem = parseFloat(this.forms.value.otimista)/100
    const pessimista = parseFloat(this.forms.value.pessimista)/100

    let dataNumbers: number[] = []
    let dataNumbersPessimista: number[] = []

    dataNumbers.push(valorInicial)
    dataNumbersPessimista.push(valorInicial)

    let max = valorInicial + (valorInicial * porcentagem)
    dataNumbers.push(parseFloat(max.toFixed(2)))

    for(let i = 0; i < 10; i++) {

      max = max + (max * porcentagem)
      let fixed = parseFloat(max.toFixed(2))

      dataNumbers.push(fixed)
    }

    max = valorInicial + (valorInicial * pessimista)
    dataNumbersPessimista.push(parseFloat(max.toFixed(2)))

    for(let i = 0; i < 10; i++) {

      max = max + (max * pessimista)
      let fixed = parseFloat(max.toFixed(2))

      dataNumbersPessimista.push(fixed)
    }

    this.gerarGrafico(dataNumbers, dataNumbersPessimista)
  }
}

voltar(): void {
  this.forms.reset()
  this.forms.clearAsyncValidators()
  this.show = false
  this.visible = 'notVisible'
  this.chart.destroy()
}

}

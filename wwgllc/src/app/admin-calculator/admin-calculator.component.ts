import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

declare function calculator(hotspots, mode): any;
declare function turnOffButton(): any;
declare function tocsv(key): any;
declare var finalData: Map<string, any>;
declare function getName2(hash): any;
declare function getLessor2(hash): any;
declare var hotspots: Map<any, any>;

export enum CalcMode {
  ADMIN = 1,
  PEOPLES = 2
}

// const months = ["Janruary", "February", "March", "April", "May", "June", "July","August", "September", "October", "November", "December"];

@Component({
  selector: 'app-admin-calculator',
  templateUrl: './admin-calculator.component.html',
  styleUrls: ['./admin-calculator.component.scss'],
  providers: [DatePipe]
})
export class AdminCalculatorComponent implements OnInit {  

  startDate = "";
  endDate = "";

    constructor(private store: AngularFirestore, private datePipe: DatePipe) { }
  
    ngOnInit() {
      this.getCurrentPeriod();
    }

  //   sort(colName) {
  //     this.items.sort((a, b) => a[colName] > b[colName] ? 1 : a[colName] < b[colName] ? -1 : 0)
  // }

    submitting(){
      turnOffButton();
      console.log("submitting");
      const ac = this.store.collection('hotspots').get();
      console.log(ac);
      var hotspoters = new Map();
      ac.subscribe(data => {
        console.log(data.docs);
        var counter = 0;
        const max = data.docs.length-1;
        data.docs.forEach(document => {
          var aa = this.store.collection('hotspots').doc(document.id);
          aa.get().subscribe(data => {
            hotspoters.set(data.id, 
              { name: data.get("name"), 
                lessor: data.get("currentHost"), 
                pcDollar: data.get("pcDollar"),
                pcHNT: data.get("pcHNT"),
                paymentMeta: data.get("paymentMeta"),
                method: data.get("method"),
                fee: data.get("fee")
              });
            // console.log(data.get("name") + data.id);
            if(counter == max){
              calculator(hotspoters, CalcMode.ADMIN);
            }else{
              counter++;
            }
          });
          
        });
        
      });
    }

    getCurrentPeriod(){
      var started = new Date();
      var ended = new Date();
      if(started.getUTCDate() < 16){
        started.setDate(1);
        ended.setDate(16);
      }else{
        started.setDate(16);
        ended.setDate(1);
        ended.setMonth(ended.getUTCMonth() + 1);
      }
      this.startDate = this.datePipe.transform(started, 'yyyy-MM-dd');
      this.endDate = this.datePipe.transform(ended, 'yyyy-MM-dd');
    }

    getLast3Days(){
      const today = new Date();
      var started = new Date(today);
      started.setDate(started.getDate() - 2);
      var ended = new Date(today);
      ended.setDate(ended.getDate() + 1);
       this.startDate = this.datePipe.transform(started, 'yyyy-MM-dd');
       this.endDate = this.datePipe.transform(ended, 'yyyy-MM-dd');
    }

    // currentDateAndPeriods(): void {
    //   for(let yearC = 21; yearC < 27; yearC++){
    //     for(let counter5 = 0; counter5 < 24; counter5++){
    //       const today = new Date();
    //       let startYear = 2000+yearC;
    //       let startMonth = Math.floor((counter5)/2);
    //       let startDay = (counter5%2 == 0? 1: 16);
    //       let endDay = (counter5%2 == 1? 1: 16);
    //       let endMonth = startMonth;
    //       let endYear = startYear;
    //       if(startDay == 16){
    //         endMonth++;
    //       }
    //       if(endMonth == 12){
    //         endMonth = 0;
    //         endYear++;
    //       }
    //       // console.log(today.valueOf());
    //       // console.log(new Date(startYear, startMonth, startDay).valueOf());
    //       if(today.valueOf() > new Date(startYear, startMonth, startDay).valueOf()){
    //         this.periods.set(this.months[startMonth] + " #" + (counter5%2+1) + ", 20" + yearC, 
    //           {start: new Date(startYear, startMonth, startDay), 
    //             end: new Date(endYear, endMonth, endDay)});
    //       }
    //     }
    //   }
    //   this.displayPeriods = Array.from(this.periods.keys());
    //   this.displayPeriods.splice(0,5);
    //   // console.log(this.periods);
  
    //   // this.checkForAnswers();
    //   setTimeout(() => {
    //     this.doStuff();
    //   }, 500);
    // }

}










  /*  export class CalculatorComponent implements OnInit {
  // tik = 1;
  finalData2: Map<string, any>;
  // Order by ascending property value
  valueAscOrder = (a: KeyValue<string,any>, b: KeyValue<string,any>): number => {
    console.log(a.value);
    console.log(a.value.length);
    console.log(a.value[a.value.length]);
    if(b.value.length == 0 || a.value.length == 0){
      return 0;
    }
    return (b.value[b.value.length-1]["amount_HNT_token"]) - (a.value[a.value.length-1]["amount_HNT_token"]);
}

  months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];
  periods = new Map<string, any>();
  displayPeriods = [];
  periodCounter = 1;

  constructor() { }

     // ngOnInit?(): void {
    //   for(let yearC = 21; yearC < 27; yearC++){
    //     for(let counter5 = 0; counter5 < 24; counter5++){
    //       const today = new Date();
    //       let startYear = 2000+yearC;
    //       let startMonth = Math.floor((counter5)/2);
    //       let startDay = (counter5%2 == 0? 1: 16);
    //       let endDay = (counter5%2 == 1? 1: 16);
    //       let endMonth = startMonth;
    //       let endYear = startYear;
    //       if(startDay == 16){
    //         endMonth++;
    //       }
    //       if(endMonth == 12){
    //         endMonth = 0;
    //         endYear++;
    //       }
    //       // console.log(today.valueOf());
    //       // console.log(new Date(startYear, startMonth, startDay).valueOf());
    //       if(today.valueOf() > new Date(startYear, startMonth, startDay).valueOf()){
    //         this.periods.set(this.months[startMonth] + " #" + (counter5%2+1) + ", 20" + yearC, 
    //           {start: new Date(startYear, startMonth, startDay), 
    //             end: new Date(endYear, endMonth, endDay)});
    //       }
    //     }
    //   }
    //   this.displayPeriods = Array.from(this.periods.keys());
    //   this.displayPeriods.splice(0,5);
    //   // console.log(this.periods);
  
    //   // this.checkForAnswers();
    //   setTimeout(() => {
    //     this.doStuff();
    //   }, 500);
    // }

  doStuff(){
    this.finalData2 = new Map();
    var e = (document.getElementById("periodSelect")) as HTMLSelectElement;
    var sel = e.selectedIndex;
    var opt = e.options[sel];
    // var CurValue = opt.value;
    // var CurText = opt.text;
    calculator(this.periods.get(opt.text).start.valueOf(), this.periods.get(opt.text).end.valueOf());
    // console.log("finalData");
    // console.log(finalData);
    // setTimeout(() => {
      setInterval(() => {
        this.finalData2 = finalData;
      }, 1800);
    // }, 1500);
    // this.tik = 1;
  }

  tocsv2(key){
    // console.log("merp");
    tocsv(key);
  }

  getLessor(hash){
    return hotspots.get(hash).lessor;
}

getName(hash){
    return hotspots.get(hash).name;
}

  // checkForAnswers(){
  //   setTimeout(this.checkAnswers.bind(this), (500*this.tik));
  // }

  // checkAnswers = () => {
    // console.log("aaa");
  //     console.log(finalData);
  //     this.finalData2 = finalData;
  //     this.tik = this.tik + 1;
  //     this.checkForAnswers;
  // }

} */

import { Body, Controller, Get, Post, Render, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { newaccountdto } from './newAccount.dto';
import { Response } from 'express';
import { error } from 'console';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHello() {
    return {
      message: this.appService.getHello()
    };
  }

  #accounts=[
    {
      id:'1234-5678',
      owner:'Admin',
      balance:15000,
    },
    {
      id:'2222-3333',
      owner:'Józsi',
      balance:10000,
    },
    {
      id:'8888-6666',
      owner:'Me',
      balance:150000,
    },
  ]

  @Get('newaccount')
  @Render('newaccountform')
  newaccountform(){
    return{
      errors:[],
      data:{}

    }
  }

  @Post('newaccount')
  newaccount(@Body() accountdata: newaccountdto,@Res() response:Response){
    const errors:string[]=[]
    if(!accountdata.balance||!accountdata.id||!accountdata.owner){
      errors.push("Minden mezőt kötelező megadni!")
    }
    let newaccount={
      id:accountdata.id,
      owner:accountdata.owner,
      balance: parseInt(accountdata.balance)
    }
    if(errors.length>0){
      response.render("newaccountform",{
        errors,
        data:accountdata
      })
    }

    this.#accounts.push(newaccount)
    response.redirect(303,'/newaccountsuccess')
   
  }

  @Get('newaccountsuccess')
  @Render('success')
  newaccountsuccess(){
    return{
      accounts:this.#accounts.length
    }
  }
}

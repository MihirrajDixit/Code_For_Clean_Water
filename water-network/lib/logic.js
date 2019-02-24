//script


/**
 * Track the trade of a commodity from one trader to another
 * @param {org.example.waternetwork.updateIotData} t - the trade to be processed
 * @transaction
 */

async function updateIotData(t){
  let assetRegistry = await getAssetRegistry('org.example.waternetwork.Iotdata');
  
   t.iot.currentMeterAVol=t.currentMeterAVol
   t.iot.currentMeterBVol=t.currentMeterBVol
  
   t.iot.TotalMeterAVol+=t.currentMeterAVol
   t.iot.TotalMeterBVol+=t.currentMeterBVol
  
   t.iot.MeterBPH=t.MeterBPH
   t.iot.MeterBSolids=t.MeterBSolids
   t.iot.MeterBHardness=t.MeterBHardness
   t.iot.MeterBOil=t.MeterBOil
   t.iot.MeterBBOD=t.MeterBBOD
   t.iot.TimeStamp=t.TimeStamp
   t.iot.count=t.count
   t.iot.waterCleanOrDirty=t.waterCleanOrDirty
   await assetRegistry.update(t.iot)
}



    /**
 * Track the trade of a commodity from one trader to another
 * @param {org.example.waternetwork.qualityWrc} t - the trade to be processed
 * @transaction
 */

async function qualityWrc(t){

    let assetRegistry = await getAssetRegistry('org.example.waternetwork.Wrc');
  let iotRegistry = await getAssetRegistry('org.example.waternetwork.Iotdata');
  
  if(!(t.currentIotData.MeterBPH>=6.5 && t.currentIotData.MeterBPH<=8.5 && t.currentIotData.MeterBSolids<100 && t.currentIotData.MeterBHardness<150 && t.currentIotData.MeterBOil<50 && t.currentIotData.MeterBBOD<50)){
    throw new Error('Quality Factor not met....')     
  }
 
  ////Quality Factor Computation
 
 
  let qualityFactor=((100-t.currentIotData.MeterBSolids)+(150-t.currentIotData.MeterBHardness)+(50-t.currentIotData.MeterBOil)+(50-t.currentIotData.MeterBBOD))/350;
  
  t.currentIotData.qualityFactor=qualityFactor
  t.wrc.WrcDue-=t.currentIotData.qualityWrcWeight*qualityFactor
 
  await assetRegistry.update(t.wrc)
  await iotRegistry.update(t.currentIotData)
}



  /**
 * Track the trade of a commodity from one trader to another
 * @param {org.example.waternetwork.quantityWrc} t - the trade to be processed
 * @transaction
 */

async function quantityWrc(t){

    let assetRegistry = await getAssetRegistry('org.example.waternetwork.Wrc');
	let iotRegistry = await getAssetRegistry('org.example.waternetwork.Iotdata');
  	let threshold,quantityWrcWeight;
  if(((t.currentIotData.count)%24)!=0)
    throw new Error('Count is not yet multiple of 24');
  
  
  
  //Money Data intially
  //Large Industries & Industrial Park-10000
  //Urban Local Bodies & Municipal Councils-5000
  //Housing Complexes & Gated Communities-1000
  
  
  //WRC intially Quantity Weight Values
  //Large Industries & Industrial Park-3
  //Urban Local Bodies & Municipal Councils-2
  //Housing Complexes & Gated Communities-1
  
  //WRC intially Quality Weight Values
  //Large Industries & Industrial Park-1
  //Urban Local Bodies & Municipal Councils-1
  //Housing Complexes & Gated Communities-1
  
  //WRC Due Values
  //Large Industries & Industrial Park-300
  //Urban Local Bodies & Municipal Councils-200
  //Housing Complexes & Gated Communities-100
  
  
  
  
  switch(t.currentIotData.owner.classes)
  {
    case "Large Industries & Industrial Park":
      threshold=0.3
      quantityWrcWeight=t.currentIotData.quantityWrcWeight
      console.log('loop');
      break;
      
    case "Urban Local Bodies & Municipal Councils":
    quantityWrcWeight=t.currentIotData.quantityWrcWeight
      threshold=0.45
      break;
      
    case "Housing Complexes & Gated Communities":
      quantityWrcWeight=t.currentIotData.quantityWrcWeight
      threshold=0.20
  }
 
 
  let ratioThreshold=(t.currentIotData.TotalMeterBVol)/(t.currentIotData.TotalMeterAVol)
 
  if(ratioThreshold>threshold)
  {
    t.wrc.WrcDue-=ratioThreshold*quantityWrcWeight
   }
  
  
  t.currentIotData.TotalMeterBVol=0
  t.currentIotData.TotalMeterAVol=0
  await iotRegistry.update(t.currentIotData)
  await assetRegistry.update(t.wrc)
}







    /**
 * Track the trade of a commodity from one trader to another
 * @param {org.example.waternetwork.moneySetData} t - the trade to be processed
 * @transaction
 */

async function moneySetData(t){
 
  let moneyRegistry = await getAssetRegistry('org.example.waternetwork.Money');
  
  	t.money.Money_data+=t.moneyValue

  await moneyRegistry.update(t.money)
  	
}







   /**
 * Track the trade of a commodity from one trader to another
 * @param {org.example.waternetwork.WRCTrade} t - the trade to be processed
 * @transaction
 */

async function WRCTrade(t){
  
      if(t.data.count<=24*60)
    {
        throw new Error('Trading phase not started.....')
    }
 
 
  let wrcRegistry = await getAssetRegistry('org.example.waternetwork.Wrc');
 let moneyRegistry = await getAssetRegistry('org.example.waternetwork.Money');
  
 
  if(t.wrcSeller.WrcDue>0)
  {
           throw new Error('You are still an under achiver')
  }
 
  if(t.wrcBuyer.WrcDue<0)
  {
           throw new Error('You are an over achiver')
  }
 
  console.log('out');
 
  let cost=1000;
  if((-(t.wrcSeller.WrcDue)>=t.wrcTradeValue) && t.wrcBuyer.money.Money_data>=t.wrcTradeValue*cost)
  {
    
        t.wrcSeller.WrcDue+=t.wrcTradeValue
        t.wrcSeller.money.Money_data+=t.wrcTradeValue*cost
        t.wrcBuyer.WrcDue-=t.wrcTradeValue
       	t.wrcBuyer.money.Money_data-=t.wrcTradeValue*cost
   
  }
  else
  {
  		throw new Error('Transaction cannot occur either because of insufficient funds or Seller doesnt have sufficient WRCs')
  }
 
 
 
  await wrcRegistry.updateAll([t.wrcSeller,t.wrcBuyer])
  await moneyRegistry.updateAll([t.wrcSeller.money,t.wrcBuyer.money])
 
 
}





    /**
 * Track the trade of a commodity from one trader to another
 * @param {org.example.waternetwork.WRCToIncentives} t - the trade to be processed
 * @transaction
 */

async function WRCToIncentives(t){
  
   if(t.currentIotData.count!=24*90)
    {
        throw new Error('3 months not completed yet to receive incentives')
    }
 
  
 
  
  let wrcRegistry = await getAssetRegistry('org.example.waternetwork.Wrc');
  let iotRegistry = await getAssetRegistry('org.example.waternetwork.Iotdata');
  let moneyRegistry = await getAssetRegistry('org.example.waternetwork.Money');
  

  	t.wrc.money.Money_data+=(-t.wrc.WrcDue)*1000
    t.wrc.WrcDue=t.wrcIntialDueValueSet
  	t.currentIotData.count=0
  
  await wrcRegistry.update(t.wrc)
  await iotRegistry.update(t.currentIotData)
  await moneyRegistry.update(t.wrc.money)
  
  	
}







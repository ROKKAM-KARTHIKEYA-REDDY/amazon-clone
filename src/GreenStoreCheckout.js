import React from 'react';
import "./GreenStoreCheckout.css";
import Greenproducts from './Greenproducts';

function Home() {
  return (
    <div className='Greenstorehome'>
      <div className='Greenstorehome_container'>
        <img className="Greenstorehome_image" src="/ECO.png" />

        <div className='Greenstorehome_row'>
          <Greenproducts 
            id="123431"
            title="Happy Cove Solid Husk Eco Friendly 10 inch Dinner Plates..."
            price={448}
            image="/plates.png"
            rating={70}
            certifications={["USDA Organic", "COSMOS Organic", "FSC"]}
          />

          <Greenproducts 
            id="12349"
            title="Beco Bamboo Soft Facial Tissue Papers..."
            price={211}
            image="/tissues.png"
            rating={50}
            certifications={["FSC", "C2C", "Blue Angel"]}
          />
        </div>

        <div className='Greenstorehome_row'>
          <Greenproducts 
            id="12348"
            title="bioQ Box of 50 Plantable Pencils With Seeds..."
            price={465}
            image="/pencils.png"
            rating={0}
            certifications={["USDA Organic", "GOTS", "COSMOS"]}
          />
          <Greenproducts 
            id="12347"
            title="Organic B Bamboo Tribal Travel Kit..."
            price={312}
            image="/comb.png"
            rating={20}
            certifications={["Organic", "COSMOS Organic", "FSC"]}
          />
          <Greenproducts 
            id="12346"
            title="Cubic Eco-Friendly Pocket Planner..."
            price={141}
            image="/book.png"
            rating={80}
            certifications={["FSC", "C2C", "Blue Angel"]}
          />
        </div>

        <div className='Greenstorehome_row'>
          <Greenproducts 
            id="12345"
            title="Growfitz Premium Mixed Dried Fruits..."
            price={400.89}
            image="/food.png"
            rating={40}
            certifications={["Organic", "GOTS", "COSMOS"]}
          />
        </div>

      </div>
    </div>
  );
}

export default Home;

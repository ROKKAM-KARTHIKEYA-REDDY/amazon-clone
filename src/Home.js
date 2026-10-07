import React from 'react';
import "./Home.css";
import Product from './Product';

function Home() {
  return (
    <div className='home'>
      <div className='home_container'>
        <img className="home_image" src="/front.jpg" alt="Eco-friendly products banner" />
        
        <div className='home_row'>
            <Product 
              id="123431" 
              title="Cutting EDGE Plastic Round Solid Double Color Dinner Plates for Daily Use, Party, Home, Kitchen, Unbreakable, Dishwasher, Freezer Safe (Black, Set of 6)" 
              price={448} 
              image="/plates.png" 
              rating={5}
              category="eco-friendly"
            />
            <Product 
              id="12349" 
              title="Beco Bamboo Soft Facial Tissue Papers- 100 Pulls (Pack of 6), 600 Pulls - 2 ply,100% Natural and Ecofriendly, Soft tissue box/pack" 
              price={211} 
              image="/tissues.png" 
              rating={5}
              category="non-eco-friendly"
            />
        </div>
        
        <div className='home_row'>
            <Product 
              id="12348" 
              title="bioQ Box of 50 Plantable Pencils With Seeds| Eco Friendly Stationary " 
              price={465} 
              image="/pencils.png" 
              rating={4}
              category="eco-friendly"
            />
            <Product 
              id="12347" 
              title="Organic B Bamboo Tribal Travel Kit|1 Bamboo Manual,Adult" 
              price={312} 
              image="/comb.png" 
              rating={3}
              category="eco-friendly"
            />
            <Product 
              id="12346" 
              title="Cubic Eco-Friendly Pocket Planner – Recycled Paper | " 
              price={141} 
              image="/book.png" 
              rating={5}
              category="eco-friendly"
            />
        </div>
        
        <div className='home_row'>
            <Product 
              id="12345" 
              title="Growfitz Premium Mixed Dried Fruits | Export Quality | 15 in 1 Trail Mix | " 
              price={400.89} 
              image="/food.png" 
              rating={1}
              // No category specified will default to non-eco-friendly
            />
        </div>
      </div>
    </div>
  ); 
}

export default Home;
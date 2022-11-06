import styled from 'styled-components/macro'
import { COLORS } from '../GlobalStyles'
import sun from '../assets/sun.svg'
import water from '../assets/water.svg'
import temp from '../assets/temp.svg'
import humidity from '../assets/humidity.svg'

export const Guidelines = () => {
  return (
    <Wrapper>
      <section className='heading'>
        <h1>houseplant care tips</h1>
      </section>
      <section className='info-section'>
        <h2>
          <img className='icon' src={sun} alt='' />
          Light
        </h2>
        <p>
          In the wild, plants are exposed to varying levels of light - from deep shade on the forest
          floor under a thick canopy, to dappled or partial sun in the tropical jungle, and full sun
          in the desert or plains. Plants are highly adaptable and as we brought them into our
          homes, they've acclimated to our indoor environments.
        </p>
        <p>
          Note: this assumes your plants are getting their light via windows in your home. Grow
          lights are not covered here.
        </p>

        <h3>low to bright indirect</h3>
        <p>
          Low light doesn't mean no light! Every houseplant should be in a room with a window, at
          minimum. All houseplants grow best when they receive bright indirect light but some can be
          tolerant of lower light levels, such as the Snake Plant and ZZ Plant. These plants can be
          placed in a window that doesn't receive much light (for example due to obstruction from
          neighboring buildings or trees), or across the room from windows that get full or partial
          sun.
        </p>

        <h3>medium to bright indirect</h3>
        <p>
          Certain plants, like ferns, are used to growing in the shade and can be placed a few feet
          away from windows that get full or partial sun. Take care not to expose them to direct sun
          or their leaves will burn.
        </p>

        <h3>bright indirect</h3>
        <p>
          The recommended light level for most houseplants. Put them near a window that receives
          plenty of light but try not to expose them to direct sun or they may burn. Up to an hour
          or so of sun in the morning or evening is safe. You can protect from direct sun by using
          sheer curtains or placing your plants off to the side of the window where the sun doesn't
          reach.
        </p>

        <h3>direct sun</h3>
        <p>
          If a plant requires direct sun, it's probably not really a houseplant. They should be
          placed outside on your patio or planted in your garden.
        </p>
      </section>
      <section className='info-section'>
        <h2>
          <img className='icon' src={water} alt='' />
          Water
        </h2>
        <p>
          How much water your plant needs is highly dependent on your own watering habits, the soil,
          the size and type of pot, ambient temperature, and the plant itself. Plants with tough
          leaves or thick roots can store more water and typically need to be watered less
          frequently than plants with delicate leaves or thin roots.
        </p>
        <p>
          Make sure your all of your pots have drainage holes so your plants don't sit in
          water-logged soil (you can use saucers or decorative cache pots to protect your
          furniture). If you can move your plants, consider watering them in your sink or tub to
          contain the mess and let them drain. Terracotta pots allow soil to dry faster than plastic
          pots, which can help prevent overwatering. Plants also require less water during cooler
          seasons when they're not actively growing.
        </p>
        <p>
          A note on water hardness: certain plants (such as calathea, stromanthe and peace lilies)
          may suffer crispy leaves if given tap water, especially if it has a high mineral content.
          These plants would fare better with filtered or distilled water. They are also more likely
          to burn from chemical fertilizers (give them something organic instead, like worm castings
          - either mixed into the soil or dissolved in water).
        </p>

        <h3>low</h3>
        <p>
          Allow soil to dry out and then water generously, ensuring any excess water is drained.
          Plants that require low water (like cacti, succulents and other tough plants) do best in
          terracotta pots.
        </p>

        <h3>medium</h3>
        <p>
          Wait until top 10-20% of soil is dry (1-3 inches depending on size of pot), then water
          until it runs from drainage hole and allow to drain. Plants that require medium water such
          as monstera can do well in either plastic or terracotta pots.
        </p>

        <h3>high</h3>
        <p>
          Water when top of soil is dry to touch to keep it moist throughout. Do not overwater - add
          just enough for it to start dripping through and then let drain. Plants that don't like to
          dry out between waterings, like ferns, do best in plastic pots which hold water longer.
        </p>
      </section>
      <section className='info-section'>
        <h2>
          <img className='icon' src={temp} alt='' />
          Temperature
        </h2>
        <p>
          Probably the least complicated aspect of plant care - if you're comfortable, your plants
          are probably comfortable. Most houseplants prefer temperatures between 55-85F. Take care
          to avoid exposing them to hot or cold drafts such as from open windows, doors, or air
          conditioning / heating units.
        </p>

        <h3>average</h3>
        <p>55-75°F (13-24°C)</p>
        <p>Likely tolerant of lower temperatures.</p>

        <h3>above average</h3>
        <p>65-85°F (18-29°C)</p>
        <p>More likely to suffer from cold drafts.</p>
      </section>
      <section className='info-section'>
        <h2>
          <img className='icon' src={humidity} alt='' />
          Humidity
        </h2>
        <p>
          Humidity is the measure of moisture in the air. Tropical plants tend to suffer crispy leaf
          tips in low humidity environments. You can check your humidity levels using a hygrometer.
          Note that humidity can rise and fall throughout the day and vary in different areas of
          your home (any rooms where water flows freely will have higher humidity, like the kitchen
          and bathroom). The best way to increase the ambient humidity for your plants is by using a
          humidifer. You can also group plants together, use a mister or place plants on trays of
          pebbles and water, but these methods provide an overall lower or temporary boost of
          humidity.
        </p>

        <h3>low</h3>
        <p>30-40%</p>
        <p>
          Plants with thick leaves or roots which store a lot of water in their leaves (such as
          cacti and succulents).
        </p>

        <h3>medium</h3>
        <p>40-50%</p>
        <p>
          Plants with large leaves, leaves or roots of average thickness (such as pothos and
          monstera).
        </p>

        <h3>high</h3>
        <p>50-60%+</p>
        <p>
          Plants with small and/or delicate leaves or fine roots, or from high humidity climates
          (such as ferns and alocasia).
        </p>
      </section>
      <section className='info-section'>
        <h2>miscellaneous tips</h2>

        <h3>potting mix</h3>
        <p>
          The kind of soil or potting mix your plants are in can greatly affect their health and how
          often they need to be watered. For best results, try to provide a balanced mixture of
          materials like coco coir or peat moss for water absorption, organic compost / fertilizer
          for nutrients (like worm castings), and pumice, sand, perlite or wood chips to aid in
          drainage and allow roots to breathe. Avoid water rentitive crystals as they cause the soil
          to hold too much water and tend to cause root rot.
        </p>
        <p>
          If you want to try making your own potting mix, here's a great universal recipe that works
          for almost any plant:
        </p>
        <ul>
          <li>55% coco coir or peat moss (try to use coco coir as it is a sustainable resource)</li>
          <li>
            20% perlite, pumice, coarse sand, or small wood chips (or a combination of these
            materials)
          </li>
          <li>25% organic compost (eg. worm castings)</li>
        </ul>
        <p>
          This mixture can be made once and stored in a bucket or tote with a lid (store it dry to
          avoid growths of mold or fungus). Add additional drainage materials for cactus and
          succulents, and extra compost for heavy feeders.
        </p>

        <h3>air circulation</h3>
        <p>
          Some plants may benefit from circulating air between their leaves. The increased air flow
          can help prevent or reduce pests and mold. you can use a fan or provide an open window (as
          long as it's not too hot or cold outside).
        </p>

        <h3>toxicity</h3>
        <p>
          If you have pets or little children, take care to note if any your plants are toxic. Many
          houseplants contain substances in their sap which can irritate skin or cause vomiting or
          illness and even death when injested. Toxic plants should be kept out of reach of pets and
          children. Bitter sprays may also help by making the plants taste unpleasant, but if your
          pets or children are stubborn you might want to consider only having nontoxic plants in
          your home instead. Always double check online if you aren't sure which plants are toxic.
          If you suspect your pet or child has gotten to a toxic plant and become ill, call
          emergency services.
        </p>
      </section>
    </Wrapper>
  )
}

const Wrapper = styled.main`
  .heading {
    background: ${COLORS.light};
    h1 {
      line-height: 1.2;
      margin-bottom: 10px;
    }
    .subheader {
      font-style: italic;
      font-size: 1.2rem;
    }
    .disclaimer {
      font-size: 0.8rem;
      margin-top: 30px;
    }
  }
  .info-section {
    background: #fff;
    h2 {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    h3 {
      margin-top: 30px;
    }
    p {
      margin: 10px 0;
    }
    ul {
      font-style: italic;
    }

    .icon {
      height: 25px;
      width: 25px;
    }
  }
`

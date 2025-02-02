<script>
  import { getContext } from "svelte";
  import Section from "$components/article/Section.svelte";
  import Hero from "$components/article/Hero.svelte";
  import Viewport from "$runes/Viewport.svelte.js";
  import Footer from "$components/article/Footer.svelte";
  import Lede from "$components/article/Lede.svelte";

  const viewport = new Viewport();
  const copy = getContext("copy");
  const data = getContext("data");

  //STEP LOGIC

  function stepHandler(step) {
    switch (true) {
        case step == 0 || !step:
            return {
              renderedData: data.sankeydata,
              focusHover: null,
              caption: 'Here is how all the votes flowed, from round 2 to round 20.'
            }
          case step >= 1 && step < 2:
            return {
              renderedData: data.sankeydata,
              focusHover: "top5",
              caption: "The top five candidates by initial round vote count represent 288,738 individual rank 1 votes."
            }
          case step >= 2 && step < 3:
            return {
              renderedData: data.sankeydata,
              focusHover: "Liv (Viva) Osthus",
              caption: 'Liv (Viva) Osthus was eliminated in round 18, with an accumulated vote total of 23,584.'
            }
          case step >= 3 && step < 4:
            return {
              renderedData: data.sankeydata,
              focusHover: "Mingus Mapps",
              caption: 'Mingus Mapps was eliminated in round 19, with an accumulated vote total of 45,156.'
            }
          case step >= 4 && step < 5:
            return {
              renderedData: data.sankeydata,
              focusHover: "Rene Gonzalez",
              caption: "The 26,014 votes transferred to Wilson from Gonzalez in round 20 pushed Wilson over the election threshold, ending the rounds."
            }
          case step >= 5 && step < 6:
            return {
              renderedData: {barData: data.bardata, thresholds: data.thresholds},
              focusHover: {focus: null, column: null},
              caption: "The election threshold is a moving target."
            }
          case step >= 6 && step < 7:
            return {
              renderedData: {barData: data.bardata, thresholds: data.thresholds},
              focusHover: {focus: [1, 2], column: 1},
              caption: "In round 2 with 309,963 votes in play, the election threshold is 154,982."
            }
          case step >= 7 && step < 8:
            return {
              renderedData: {barData: data.bardata, thresholds: data.thresholds},
              focusHover: {focus: [1, 2], column: 2},
              caption: "In round 3 with 309,867 votes in play, the election threshold moves to 154,934."
            }
          case step >= 8 && step < 9:
            return {
              renderedData: {barData: data.bardata, thresholds: data.thresholds},
              focusHover: {focus: [17, 18, 19], column: 17},
              caption: "The election threshold is 150,193 in round 18, with 300,384 votes in play."
            }
          case step >= 9 && step < 10:
            return {
              renderedData: {barData: data.bardata, thresholds: data.thresholds},
              focusHover: {focus: [17, 18, 19], column: 18},
              caption: "The election threshold is 144,924 in round 19, with 289,847 votes in play."
            }
          case step >= 10 && step < 11:
            return {
              renderedData: {barData: data.bardata, thresholds: data.thresholds},
              focusHover: {focus: [12, 19], column: 19},
              caption: "In round 20, with the transfer of Rene Gonzalez's votes, Wilson crosses the threshold of 129,977."
            }
          case step >= 11:
            return {
              renderedData: {barData: data.bardata, thresholds: data.thresholds},
              focusHover: {focus: null, column: null},
              caption: "show all"
            }
          default:
            return {
              renderedData: null,
              focusHover: null
            }
    }
  }
</script>

<main id="content">
  <Hero content={copy.body.find(f => f.section === "intro").content} />
  <Lede content={copy.body.find(f => f.section === "lede").content} />
  <Section
    copy={copy.body.find(f => f.section === "body").content}
    {stepHandler}
    viewportHeight = {viewport.height}
    switcher="bubbles"
  ></Section>
  <Footer></Footer>
</main>

<style>
  :global(body) {
    font-family: "Fira Sans", serif;
  }
  :global(h1) {
    font-weight: 600;
  }
  :global(h3) {
    font-weight: 200;
  }
  :global(p) {
    font-weight: 400;
    font-size: 18px;
  }
</style>

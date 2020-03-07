<template>
  <div class="content container">
    <h1>Imprint</h1>

    <h2>Information according to § 5 TMG</h2>
    <p>Timon Christiansen<br />
      Storkower Str. 205a<br />
      Apartment 8<br />
      10369 Berlin</p>

    <h2>Contact</h2>
    <p>Phone: 01731527561<br />
      E-Mail: timon.christiansen@code.berlin</p>

    <h3>Liability for contents</h3>
    <p>As a service provider, we are responsible for our own content on these pages according to § 7 para.1 TMG (German Telemedia Act) and general laws. According to §§ 8 to 10 TMG, we are not obliged to monitor transmitted or stored external information or to investigate circumstances that indicate illegal activity.</p>
    <p>Obligations to remove or block the use of information according to general laws remain unaffected. However, liability in this respect is only possible from the time of knowledge of a concrete infringement. If we become aware of any such infringements, we will remove such content immediately.</p>
    <h3>Liability for links</h3>
    <p>Our offer contains links to external websites of third parties, on whose contents we have no influence. Therefore we cannot assume any liability for these external contents. The respective provider or operator of the sites is always responsible for the contents of the linked sites. The linked pages were checked for possible legal violations at the time of linking. Illegal contents were not recognizable at the time of linking.</p>
    <p>However, a permanent control of the contents of the linked pages is not reasonable without concrete evidence of a violation of the law. If we become aware of any infringements, we will remove such links immediately.</p>
    <h3>Copyright</h3>
    <p>The contents and works on these pages created by the site operators are subject to German copyright law. The reproduction, editing, distribution and any kind of use outside the limits of copyright law require the written consent of the respective author or creator. Downloads and copies of these pages are only permitted for private, non-commercial use.</p>
    <p>Insofar as the content on this site was not created by the operator, the copyrights of third parties are respected. In particular, third-party content is marked as such. Should you nevertheless become aware of a copyright infringement, please inform us accordingly. If we become aware of any infringements, we will remove such contents immediately.</p>
    <br>
    <p>Source: <a href="https://www.e-recht24.de">https://www.e-recht24.de</a></p>
  </div>
</template>

<script>
export default {
  name: 'imprint'
}
</script>

<style scoped>
.container {
  display: block;
  text-align: left;
}
h1 {
  display: block;
  font-size: 2em;
  text-align: center;
  margin-block-start: 0.67em;
  margin-block-end: 0.67em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-weight: bold;
}
h2 {
  display: block;
  font-size: 1.5em;
  margin-block-start: 0.83em;
  margin-block-end: 0.83em;
  margin-inline-start: 0;
  margin-inline-end: 0;
  font-weight: bold;
}
h3 {
  display: block;
  font-size: 1.17em;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0;
  margin-inline-end: 0;
  font-weight: bold;
  text-align: left;
}
@media (max-width: 640px) {
  p {
    @apply px-4
  }
}

@media (min-width: 640px) {
  .container {
    max-width: 800px;
  }
}
</style>

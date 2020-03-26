<template>
  <Row>
    <Col>
      <code>{{row.SQL}}</code>
    </Col>
  </Row>
</template>

<script>
    export default {
        name: "expandTable",
        props: {
            row: Object
        }
    }
</script>

<style scoped>

</style>

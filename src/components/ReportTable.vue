<template>
  <div class="table">
    <a-table
      class="ant-table-striped"
      :columns="columns"
      :data-source="data"
      bordered
      :pagination="false"
      :scroll="{ x: 'calc(700px + 50%)', y: 510 }"
      size="small"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'group_name'">
          <a-tag class="bold" color="#AC1754" v-if="!record.group_name">Ungrouped</a-tag>
          <a-tag color="#3D8D7A" class="bold" v-else>{{ record.group_name }}</a-tag>
        </template>
        <template v-if="column.key === 'temp_00'">
          <span
            :class="{ 'no-data': record.temp_00 === null, 'no-control': record.temp_00 == 'N/C' }"
          >
            {{ record.temp_00 ?? 'N/A' }}
          </span>
        </template>
        <template v-if="column.key === 'temp_06'">
          <span
            :class="{ 'no-data': record.temp_06 === null, 'no-control': record.temp_06 == 'N/C' }"
          >
            {{ record.temp_06 ?? 'N/A' }}
          </span>
        </template>
        <template v-if="column.key === 'temp_12'">
          <span
            :class="{ 'no-data': record.temp_12 === null, 'no-control': record.temp_12 == 'N/C' }"
          >
            {{ record.temp_12 ?? 'N/A' }}
          </span>
        </template>
        <template v-if="column.key === 'temp_18'">
          <span
            :class="{ 'no-data': record.temp_18 === null, 'no-control': record.temp_18 == 'N/C' }"
          >
            {{ record.temp_18 ?? 'N/A' }}
          </span>
        </template>
        <template v-if="column.key === 'humi_00'">
          <span
            :class="{ 'no-data': record.humi_00 === null, 'no-control': record.humi_00 == 'N/C' }"
          >
            {{ record.humi_00 ?? 'N/A' }}
          </span>
        </template>
        <template v-if="column.key === 'humi_06'">
          <span
            :class="{ 'no-data': record.humi_06 === null, 'no-control': record.humi_06 == 'N/C' }"
          >
            {{ record.humi_06 ?? 'N/A' }}
          </span>
        </template>
        <template v-if="column.key === 'humi_12'">
          <span
            :class="{ 'no-data': record.humi_12 === null, 'no-control': record.humi_12 == 'N/C' }"
          >
            {{ record.humi_12 ?? 'N/A' }}
          </span>
        </template>
        <template v-if="column.key === 'humi_18'">
          <span
            :class="{ 'no-data': record.humi_18 === null, 'no-control': record.humi_18 == 'N/C' }"
          >
            {{ record.humi_18 ?? 'N/A' }}
          </span>
        </template>
      </template>
      <template #footer> <span class="bold">Total </span> : {{ data.length }} Rows</template>
    </a-table>
  </div>
</template>

<script setup>
defineProps({
  columns: {
    type: Array,
    default: () => [
      {
        title: 'Date',
        dataIndex: 'report_date',
        key: 'report_date',
        width: 100,
        fixed: 'left',
        align: 'center',
        sorter: (a, b) => new Date(a.report_date) - new Date(b.report_date),
      },
      {
        title: 'Area',
        dataIndex: 'area',
        key: 'area',
        width: 150,
        fixed: 'left',
        align: 'center',
        sorter: (a, b) => a.area.localeCompare(b.area),
      },
      {
        title: 'Group',
        dataIndex: 'group_name',
        key: 'group_name',
        width: 150,
        fixed: 'left',
        align: 'center',
        sorter: (a, b) => a.group_name.localeCompare(b.group_name),
      },
      {
        title: 'Sensor Data',
        children: [
          {
            title: 'Temperature (°C)',
            key: 'temperature',
            children: [
              {
                title: 'Range',
                key: 'range',
                children: [
                  {
                    title: 'Min',
                    key: 't_min',
                    dataIndex: 't_min',
                    align: 'center',
                  },
                  {
                    title: 'Max',
                    key: 't_max',
                    dataIndex: 't_max',
                    align: 'center',
                  },
                ],
              },
              {
                title: '00:00',
                key: 'temp_00',
                align: 'center',
                dataIndex: 'temp_00',

                sorter: (a, b) => a.temp_00 - b.temp_00,
              },
              {
                title: '06:00',
                key: 'temp_06',
                align: 'center',
                dataIndex: 'temp_06',

                sorter: (a, b) => a.temp_06 - b.temp_06,
              },
              {
                title: '12:00',
                align: 'center',
                key: 'temp_12',
                dataIndex: 'temp_12',

                sorter: (a, b) => a.temp_12 - b.temp_12,
              },
              {
                title: '18:00',
                key: 'temp_18',
                align: 'center',
                dataIndex: 'temp_18',

                sorter: (a, b) => a.temp_18 - b.temp_18,
              },
            ],
          },
          {
            title: 'Humidity (%)',
            key: 'humidity',
            children: [
              {
                title: 'Range',
                key: 'range',
                children: [
                  {
                    title: 'Min',
                    key: 'h_min',
                    align: 'center',
                    dataIndex: 'h_min',
                  },
                  {
                    title: 'Max',
                    align: 'center',
                    key: 'h_max',
                    dataIndex: 'h_max',
                  },
                ],
              },
              {
                title: '00:00',
                align: 'center',
                key: 'humi_00',
                dataIndex: 'humi_00',

                sorter: (a, b) => a.humi_00 - b.humi_00,
              },
              {
                title: '06:00',
                align: 'center',
                key: 'humi_06',
                dataIndex: 'humi_06',

                sorter: (a, b) => a.humi_06 - b.humi_06,
              },
              {
                title: '12:00',
                align: 'center',
                key: 'humi_12',
                dataIndex: 'humi_12',

                sorter: (a, b) => a.humi_12 - b.humi_12,
              },
              {
                title: '18:00',
                align: 'center',
                key: 'humi_18',
                dataIndex: 'humi_18',

                sorter: (a, b) => a.humi_18 - b.humi_18,
              },
            ],
          },
        ],
      },
    ],
  },
  data: {
    type: Array,
    default: () =>
      Array.from({ length: 100 }, (_, i) => ({
        date: '2025-02-16',
        area: `Area ${i + 1}`,
        t_min: 20,
        t_max: 25,
        h_min: 40,
        h_max: 60,
        temp_00: 21.22,
        temp_06: 21.22,
        temp_12: 21.22,
        temp_18: 21.22,
        humi_00: 21.22,
        humi_06: 21.22,
        humi_12: 21.22,
        humi_18: 21.22,
      })),
  },
})
</script>

<style scoped>
.no-data {
  font-weight: 650;
}

.no-control {
  color: #06bf3a;
  font-weight: bold;
}

.warning {
  color: #06bf3a;
  font-weight: bold;
}

.table {
  max-height: 780px;
}

.bold {
  font-weight: bold;
}
</style>

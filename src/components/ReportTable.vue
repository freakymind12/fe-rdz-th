<template>
  <div class="table">
    <a-table
      class="ant-table-striped"
      :columns="columns"
      :data-source="data"
      bordered
      :pagination="{
        pageSizeOptions: ['20', '50', '100'],
        current: reportStore.pagination.current,
        pageSize: reportStore.pagination.pageSize,
        total: reportStore.pagination.total,
        showSizeChanger: true,
        onChange: reportStore.setPage,
        onShowSizeChange: (current, size) => reportStore.setPageSize(size),
      }"
      :scroll="{ x: 'max-content', y: 550 }"
      size="small"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'group_name'">
          <a-tag class="bold" color="#AC1754" v-if="!record.group_name">Ungrouped</a-tag>
          <a-tag color="#3D8D7A" class="bold" v-else>{{ record.group_name }}</a-tag>
        </template>
        <template v-if="['temp_00', 'temp_06', 'temp_12', 'temp_18'].includes(column.key)">
          <span :class="getClass(record[column.key], record.t_min, record.t_max)">
            {{ record[column.key] ?? 'N/A' }}
          </span>
        </template>
        <template v-if="['humi_00', 'humi_06', 'humi_12', 'humi_18'].includes(column.key)">
          <span :class="getClass(record[column.key], record.t_min, record.t_max)">
            {{ record[column.key] ?? 'N/A' }}
          </span>
        </template>
      </template>
      <template #footer>
        <span class="bold">Total Data </span> : {{ reportStore.reports.total }} Rows</template
      >
      <template #emptyText>
        <a-empty>
          <template #description>
            <span class="bold">There is no data for this search filter</span>
          </template>
        </a-empty>
      </template>
    </a-table>
  </div>
</template>

<script setup>
import { useReportStore } from '@/stores/report'
const reportStore = useReportStore()

const getClass = (value, min, max) => {
  if (value === null) return { 'no-data': true } // Hindari class lain
  if (value == 'N/C') return { 'no-control': true } // Hindari class lain

  return {
    warning: value <= min * 1.1 || value >= max * 0.9,
    'error-max': value >= max,
    'error-min': value <= min,
  }
}

defineProps({
  columns: {
    type: Array,
    default: () => [
      {
        title: 'Date',
        dataIndex: 'report_date',
        key: 'report_date',
        align: 'center',
        sorter: (a, b) => new Date(a.report_date) - new Date(b.report_date),
      },
      {
        title: 'Area',
        dataIndex: 'area',
        key: 'area',
        align: 'center',
        sorter: (a, b) => a.area.localeCompare(b.area),
      },
      {
        title: 'Group',
        dataIndex: 'group_name',
        key: 'group_name',
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
  color: #ffa725;
  font-weight: bold;
}

.error-max {
  color: #fb9a98;
  font-weight: bold;
}

.error-min {
  color: #4f959d;
  font-weight: bold;
}

.table {
  max-height: 780px;
}

.bold {
  font-weight: bold;
}
</style>

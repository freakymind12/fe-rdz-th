<template>
  <div class="table">
    <a-table class="ant-table-striped" :columns="columns" :data-source="data" bordered :pagination="{
      pageSizeOptions: ['20', '50', '100'],
      current: reportStore.pagination.current,
      pageSize: reportStore.pagination.pageSize,
      total: reportStore.pagination.total,
      showSizeChanger: true,
      onChange: reportStore.setPage,
      onShowSizeChange: (current, size) => reportStore.setPageSize(size),
    }" :scroll="{ x: 'max-content', y: 410 }" size="small">
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
          <span :class="getClass(record[column.key], record.h_min, record.h_max)">
            {{ record[column.key] ?? 'N/A' }}
          </span>
        </template>
        <template v-if="['noise_00', 'noise_06', 'noise_12', 'noise_18', 'n_max', 'n_min'].includes(column.key)">
          <span :class="getClass(record[column.key], record.n_min, record.n_max)">
            {{ record[column.key] ?? 'N/A' }}
          </span>
        </template>
        <template
          v-if="['pressure_00', 'pressure_06', 'pressure_12', 'pressure_18', 'p_max', 'p_min'].includes(column.key)">
          <span :class="getClass(record[column.key], record.p_min, record.p_max)">
            {{ record[column.key] ?? 'N/A' }}
          </span>
        </template>
      </template>
      <template #footer>
        <span class="bold">Total Data </span> : {{ reportStore.reports.total }} Rows</template>
      <template #emptyText>
        <a-empty class="empty-table">
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
import dayjs from 'dayjs'

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
        width: 120,
        fixed: 'left', // 🔒 freeze di kiri
        sorter: (a, b) => dayjs(a.report_date) - dayjs(b.report_date),
      },
      {
        title: 'Area',
        dataIndex: 'area',
        width: 200,
        key: 'area',
        align: 'center',
        fixed: 'left', // 🔒 freeze di kiri
        sorter: (a, b) => a.area.localeCompare(b.area),
      },
      {
        title: 'Group',
        dataIndex: 'group_name',
        key: 'group_name',
        align: 'center',
        fixed: 'left', // 🔒 freeze di kiri
        width: 140,
        sorter: (a, b) => {
          const nameA = a.group_name || '';
          const nameB = b.group_name || '';
          return nameA.localeCompare(nameB);
        }
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
                    width: 80,
                  },
                  {
                    title: 'Max',
                    key: 't_max',
                    dataIndex: 't_max',
                    align: 'center',
                    width: 80,
                  },
                ],
              },
              {
                title: '00:00',
                key: 'temp_00',
                width: 70,
                align: 'center',
                dataIndex: 'temp_00',
                sorter: (a, b) => a.temp_00 - b.temp_00,
              },
              {
                title: '06:00',
                key: 'temp_06',
                width: 70,
                align: 'center',
                dataIndex: 'temp_06',
                sorter: (a, b) => a.temp_06 - b.temp_06,
              },
              {
                title: '12:00',
                align: 'center',
                width: 70,
                key: 'temp_12',
                dataIndex: 'temp_12',
                sorter: (a, b) => a.temp_12 - b.temp_12,
              },
              {
                title: '18:00',
                key: 'temp_18',
                width: 70,
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
                    width: 80,
                    align: 'center',
                    dataIndex: 'h_min',
                  },
                  {
                    title: 'Max',
                    align: 'center',
                    width: 80,
                    key: 'h_max',
                    dataIndex: 'h_max',
                  },
                ],
              },
              {
                title: '00:00',
                align: 'center',
                width: 70,
                key: 'humi_00',
                dataIndex: 'humi_00',
                sorter: (a, b) => a.humi_00 - b.humi_00,
              },
              {
                title: '06:00',
                align: 'center',
                width: 70,
                key: 'humi_06',
                dataIndex: 'humi_06',
                sorter: (a, b) => a.humi_06 - b.humi_06,
              },
              {
                title: '12:00',
                align: 'center',
                width: 70,
                key: 'humi_12',
                dataIndex: 'humi_12',
                sorter: (a, b) => a.humi_12 - b.humi_12,
              },
              {
                title: '18:00',
                align: 'center',
                width: 70,
                key: 'humi_18',
                dataIndex: 'humi_18',
                sorter: (a, b) => a.humi_18 - b.humi_18,
              },
            ],
          },
          {
            title: 'Noise (dB)',
            key: 'noise',
            children: [
              {
                title: 'Range',
                key: 'range',
                children: [
                  {
                    title: 'Min',
                    key: 'n_min',
                    width: 80,
                    align: 'center',
                    dataIndex: 'n_min',
                  },
                  {
                    title: 'Max',
                    align: 'center',
                    width: 80,
                    key: 'n_max',
                    dataIndex: 'n_max',
                  },
                ],
              },
              {
                title: '00:00',
                align: 'center',
                width: 70,
                key: 'noise_00',
                dataIndex: 'noise_00',
                sorter: (a, b) => a.noise_00 - b.noise_00,
              },
              {
                title: '06:00',
                align: 'center',
                width: 70,
                key: 'noise_06',
                dataIndex: 'noise_06',
                sorter: (a, b) => a.noise_06 - b.noise_06,
              },
              {
                title: '12:00',
                align: 'center',
                key: 'noise_12',
                width: 70,
                dataIndex: 'noise_12',
                sorter: (a, b) => a.noise_12 - b.noise_12,
              },
              {
                title: '18:00',
                align: 'center',
                key: 'noise_18',
                width: 70,
                dataIndex: 'noise_18',
                sorter: (a, b) => a.noise_18 - b.noise_18,
              },
            ],
          },
          {
            title: 'Pressure (Pa)',
            key: 'pressure',
            children: [
              {
                title: 'Range',
                key: 'range',
                children: [
                  {
                    title: 'Min',
                    key: 'p_min',
                    width: 80,
                    align: 'center',
                    dataIndex: 'p_min',
                  },
                  {
                    title: 'Max',
                    align: 'center',
                    width: 80,
                    key: 'p_max',
                    dataIndex: 'p_max',
                  },
                ],
              },
              {
                title: '00:00',
                align: 'center',
                width: 70,
                key: 'pressure_00',
                dataIndex: 'pressure_00',
                sorter: (a, b) => a.pressure_00 - b.pressure_00,
              },
              {
                title: '06:00',
                align: 'center',
                width: 70,
                key: 'pressure_06',
                dataIndex: 'pressure_06',
                sorter: (a, b) => a.pressure_06 - b.pressure_06,
              },
              {
                title: '12:00',
                align: 'center',
                width: 70,
                key: 'pressure_12',
                dataIndex: 'pressure_12',
                sorter: (a, b) => a.pressure_12 - b.pressure_12,
              },
              {
                title: '18:00',
                align: 'center',
                width: 70,
                key: 'pressure_18',
                dataIndex: 'pressure_18',
                sorter: (a, b) => a.pressure_18 - b.pressure_18,
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
        noise_00: 21.22,
        noise_06: 21.22,
        noise_12: 21.22,
        noise_18: 21.22,
        pressure_00: 21.22,
        pressure_06: 21.22,
        pressure_12: 21.22,
        pressure_18: 21.22,
      })),
  },
})
</script>

<style scoped>
.empty-table {
  padding: 100px 0
}

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

.bold {
  font-weight: bold;
}
</style>

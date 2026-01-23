# ucscmc Status Dashboard

A high-availability observability dashboard engineered to monitor the real-time status, latency, and uptime history of the ucscmc infrastructure (Minecraft Server, Map, and Website). This application leverages **Next.js (App Router)** for server-side rendering and **SWR** for efficient client-side data synchronization.

## 🚀 Key Features

- **Real-Time Observability**: Implements dual-stream polling to fetch instantaneous status snapshots and historical time-series data concurrently.
- **Heuristic Data Normalization**: Mitigates transient API instability by implementing a fallback algorithm that resolves `INVALID` states against the local history buffer to prevent false-negative reporting.
- **Temporal Visualization**: Renders a 7-day historical heatmap (168 hourly data points), aggregating minute-level granularity into hourly performance metrics.
- **Adaptive Responsive Layout**: Utilizes a mobile-first design strategy with context-aware grid reordering to prioritize service visibility based on the viewport.
- **Theme Persistence**: Features a robust Dark Mode implementation with local storage persistence to maintain user preference across sessions.

## 🛠 Technical Architecture

- **Framework**: [Next.js](https://nextjs.org/) (React Server Components / App Router)
- **Styling Engine**: [Tailwind CSS](https://tailwindcss.com/) (v4 configuration)
- **State Management**: [SWR](https://swr.vercel.app/) (Stale-While-Revalidate strategy)
- **Runtime**: Node.js / ES6+

---

## 🧠 Core Logic & Data Flow

The application logic is centralized within `src/lib/statusMath.js`, handling raw data transformation and statistical aggregation.

### 1. Data Ingestion Strategy
The dashboard consumes two distinct endpoints from `api.ucscmc.com` to balance freshness with payload size:
- **Snapshot Stream (`/latest`)**: Polled every **60 seconds** to provide immediate "Up/Down" status and latency metrics.
- **Historical Stream (`/history`)**: Polled every **5 minutes** to retrieve the minute-by-minute dataset used for uptime calculation and visualization.

### 2. Resilient State Normalization
To ensure UI stability, the `normalizeLatest` function implements a fault-tolerant parsing logic:
1.  **Validation**: Inspects the latest API response for `INVALID` status codes (often caused by transient probe failures).
2.  **History Traversal**: In the event of an invalid signal, the algorithm traverses the historical dataset in reverse chronological order.
3.  **State Recovery**: It identifies the last confirmed valid state (UP or DOWN) to present a stable status to the user, preventing UI flickering.

### 3. Time-Series Aggregation
While the backend provides minute-level precision, the frontend aggregates this data into a 7-day hourly view via `build7DayHourlyDots`:
- **Aggregation Window**: Data is bucketed into 60-minute intervals.
- **Optimistic Rendering**: To ensure visual continuity, missing or invalid data points within the historical strip are treated optimistically, preventing visual gaps in the timeline.

### 4. Uptime Thresholds
Service health is categorized based on the percentage of successful "UP" pings within a specific hour:

| Classification    | Visual Indicator | Uptime Threshold |
| :---------------- | :--------------- | :--------------- |
| **Operational** | 🟢 Emerald-500   | ≥ 97%            |
| **Degraded** | 🟢 Emerald-400   | 85% – 97%        |
| **Partial Outage**| 🟢 Emerald-300   | 50% – 85%        |
| **Major Outage** | ⚪ Zinc-400      | < 50%            |

---

## 📂 Project Structure

```bash
├── app/
│   ├── components/
│   │   ├── DarkModeToggle.js  # Theme context and persistence logic
│   │   ├── HistoryStrip.js    # Time-series heatmap visualization
│   │   ├── McBanner.js        # Primary status alert component
│   │   ├── PartialHelp.js     # Contextual tooltip for SLA definitions
│   │   └── StatusCard.js      # Container component for service metrics
│   ├── lib/
│   │   └── statusMath.js      # Algorithms for normalization and aggregation
│   ├── globals.css            # Tailwind directives and animation definitions
│   ├── layout.js              # Root layout and script injection
│   └── page.js                # Dashboard composition and grid layout

```

## 💻 Installation & Development

### Prerequisites

* Node.js 18+ environment
* Package manager (npm or yarn)

### Setup Instructions

1. **Clone the Repository**
```bash
git clone [https://github.com/your-username/ucscmc-status.git](https://github.com/your-username/ucscmc-status.git)
cd ucscmc-status

```


2. **Install Dependencies**
```bash
npm install

```


3. **Initialize Development Server**
```bash
npm run dev

```


4. **Access Application**
Navigate to [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) to view the local instance.

---

## ⚙️ Configuration

### Extending Service Monitoring

To add additional services to the monitoring grid, instantiate a new `<StatusCard />` component within `app/page.js`.

```jsx
<StatusCard 
  targetId="service_key" 
  title="Service Display Name" 
  subtitle="service.endpoint.com" 
/>

```

*Note: The `targetId` prop must correspond to the unique key returned by the status API.*

### Adjusting Polling Intervals

Data freshness can be tuned by modifying the `refreshInterval` configurations in `src/app/components/StatusCard.js`:

* **Metric Snapshots**: Default `60000ms` (1 minute).
* **Historical Data**: Default `300000ms` (5 minutes).

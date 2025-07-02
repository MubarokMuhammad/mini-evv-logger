# EVV Logger Backend

## Struktur Project

Project ini memiliki dua entry point untuk mendukung development lokal dan deployment Vercel:

- **`handler.go`**: Entry point untuk Vercel deployment (package handler)
- **`cmd/server/main.go`**: Entry point untuk development lokal (package main)

## Development Lokal

### Menjalankan Server

```bash
# Dari direktori backend
cd cmd/server
go run main.go

# Atau dengan port custom
PORT=8082 go run main.go
```

### Build Binary

```bash
# Dari direktori backend
go build -o server cmd/server/main.go

# Jalankan binary
./server
```

## Deployment Vercel

Vercel akan otomatis menggunakan `handler.go` sesuai konfigurasi di `vercel.json`.

## API Documentation

Setelah server berjalan, dokumentasi Swagger tersedia di:
- http://localhost:8080/swagger/index.html (default)
- http://localhost:{PORT}/swagger/index.html (custom port)

## Troubleshooting

### Port Already in Use
Jika mendapat error "address already in use", gunakan port yang berbeda:
```bash
PORT=8081 go run main.go
```

### Data File Not Found
Jika file `data/schedules.json` tidak ditemukan, server akan menggunakan data hardcoded dari `models/data.go`.
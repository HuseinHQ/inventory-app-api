module.exports = {
  apps : [{
    name   : "Inventory API",
    script : "./index.js",
    env: {
        NODE_ENV: "production",
	DATABASE_URL: "postgres://postgres.ulycdemynrpulzkridvw:postgres2024@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
    }
  }]
}

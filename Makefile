test:
	@echo "--- RUNNING PYTHON TESTS ---"
	pytest .\Python\board_helper_test.py
	pytest .\Python\bratchoku_test.py
	@echo "\n--- RUNNING JS TESTS ---"
	npm test
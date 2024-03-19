import csv

# def reduce_csv_rows(input_file, output_file, rows_to_keep):

#   with open(input_file, 'r') as infile, open(output_file, 'w', newline='') as outfile:
#     reader = csv.reader(infile)
#     writer = csv.writer(outfile)

#     # Write the header row from the input file (optional)
#     # writer.writerow(next(reader))  # Uncomment to write header row

#     # Read and write rows from the input file up to the specified limit
#     count = 0
#     for row in reader:
#       if count < rows_to_keep:
#         writer.writerow(row)
#         count += 1
#       else:
#         break

# if __name__ == '__main__':
#   input_file = 'foodyfeed-backend-main/data/recipes.csv'  # Replace with your input file path
#   output_file = 'foodyfeed-backend-main/data/recipes.csv'  # Replace with your desired output file name
#   rows_to_keep = 100000  # Change this to the number of rows you want to keep

#   reduce_csv_rows(input_file, output_file, rows_to_keep)
#   print(f"Reduced data written to {output_file}")


import pandas as pd

#
def write_non_nan_values(input_file, output_file):
  """
  Reads a CSV file, filters rows with non-NaN values, and writes them to a new CSV file.

  Args:
      input_file: Path to the input CSV file.
      output_file: Path to the output CSV file.
  """

  with open(input_file, 'r') as infile, open(output_file, 'w', newline='') as outfile:
    reader = csv.reader(infile)
    writer = csv.writer(outfile)

    # Write the header row from the input file (optional)
    writer.writerow(next(reader))  # Uncomment to write header row

    # Filter and write rows with non-NaN values
    for row in reader:
      # Check for any NaN values in the row
      if not any(pd.isna(value) for value in row):
        writer.writerow(row)

if __name__ == '__main__':
  input_file = 'foodyfeed-backend-main/data/recipes.csv'  # Replace with your input file path
  output_file = 'foodyfeed-backend-main/data/recipes_cleaned.csv'  # Replace with your desired output file name

  write_non_nan_values(input_file, output_file)
  print(f"Non-NaN data written to {output_file}")
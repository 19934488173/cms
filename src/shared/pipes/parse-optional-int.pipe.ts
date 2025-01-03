import { BadRequestException, PipeTransform } from '@nestjs/common';

export class ParseOptionalIntPipe implements PipeTransform<string, number> {
  constructor(private readonly defaultValue: number) {}
  transform(value: string): number {
    if (!value) {
      return this.defaultValue;
    }
    const parsedValue = parseInt(value, 10);
    if (isNaN(parsedValue)) {
      throw new BadRequestException(
        `Validation failed. "${value}" is not an integer.`,
      );
    }
    return parsedValue;
  }
}

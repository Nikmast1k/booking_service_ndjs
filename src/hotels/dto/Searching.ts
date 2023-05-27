import { ISearchRoomsParams } from '../interfaces/ISearchRoomsParams';

export class SearchHotelDto implements ISearchHotelParams {
  limit = 10;
  offset = 0;
}
export class SearchHotelRoomDto implements ISearchRoomsParams {
  hotel = '0';
  isEnabled = true;
  limit = 0;
  offset = 0;
}
